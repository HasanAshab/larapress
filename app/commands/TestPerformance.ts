import Command from "illuminate/commands/Command";
import { base, generateEndpointsFromDirTree } from "helpers";
import { exec, spawn } from "child_process";
import autocannon from "autocannon";
import DB from "illuminate/utils/DB";
import URL from "illuminate/utils/URL";
import User from "app/models/User";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";


export default class TestPerformance extends Command {
  private benchmarkRootPath = base("docs/parts");
  private serverProcess = spawn('npm', ['run', 'dev'], {
    env: { ...process.env, NODE_ENV: "test" }
  });
  
  async handle(){
    const { connections = 1, workers = 0, stdout = true } = this.params
    if(stdout) {
    this.serverProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    }
    this.serverProcess.unref();
    const startTime = Date.now();
    this.info("starting server...");
    this.info("connecting to database...");
    await DB.connect();
    this.info("reseting database...");
    await DB.reset();
    const config = {
      url: URL.resolve(),
      connections: parseInt(connections),
      workers: parseInt(workers),
    };
    const versions = fs.readdirSync(this.benchmarkRootPath);
    for (const version of versions) {
      this.info(`parsing benchmarks of ${version}...`);
      config.requests = await this.parseBenchmarks(version);
      config.amount = config.requests.length;
      if(config.amount === 0) {
        this.serverProcess.kill();
        this.error("No benchmark matched!");
      }
      //console.log(config)
      this.info("load test started...");
      const result = await autocannon(config);
      const outDir = "storage/reports/performance/" + version;
      await exec("mkdir -p " + outDir);
      fs.writeFileSync(path.join(outDir, Date.now() + ".json"), JSON.stringify(result, null, 2));
      this.info("clearing database...");
      await DB.reset();
    }
    this.info("closing server...");
    this.serverProcess.kill();
    this.info(`Time: ${(Date.now() - startTime) / 1000}s`)
    this.success("Test report saved at /storage/reports/performance");
  }
  
  private async parseBenchmarks(version: string) {
    global.base = base;
    const requests = [];
    const endpointPathPair = generateEndpointsFromDirTree(path.join(this.benchmarkRootPath, version));
    for(let [endpoint, path] of Object.entries(endpointPathPair)){
     if(this.params.path && endpoint !== this.params.path) continue
      const benchmarkFile = require(path);
      for(const method in benchmarkFile) {
        const doc = benchmarkFile[method];
        let context = {}; 
        const request = doc.benchmark;
        if(!request) continue;
        if(request.setupContext){
          context = await request.setupContext();
        }
        if(doc.auth) {
          context.user = await User.findOne({ role: doc.auth, verified: true }) ?? await User.factory().create({ role: doc.auth });
          request.headers = {
            "Authorization": "Bearer " + context.user.createToken()
          }
        }
        if(endpoint.includes("{")){
          if(!request.params) this.error(`param() method is required in benchmark ${path}`)
          const params = await request.params.apply(context);
          endpoint = endpoint.replace(/\{(\w+)\}/g, (match: string, key: string) => {
            const value = params[key];
            if(!value) this.error(`The "${key}" param is required in benchmark ${path}`);
            return value;
          });
        }
        request.path = "/api/" + version + endpoint;
        request.method = method.toUpperCase();
        if(request.setupRequest) {
          request.setupRequest = request.setupRequest?.bind(context);
        }
        request.onResponse = (status, body) => {
          console.log(request.path)
          if(status > 399){
            this.serverProcess.kill();
            this.error(`${request.method} -> ${request.path} \n \n STATUS: ${status} \n BODY: ${body}`);
          }
        }
        requests.push(request);
      }
    }
    return requests;
  }
  
  onError(err){
    this.serverProcess.kill();
    throw err;
  }
}