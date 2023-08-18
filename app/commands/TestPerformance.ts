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
  private cachedUsers = {};
  private startTime = Date.now();
  
  async handle(){
    const { connections = 2, workers = 0, stdout = false } = this.params
    this.info("starting server...");

    this.serverProcess.unref();
    process.on("exit", () => {
      this.info("closing server...");
      this.serverProcess.kill();
      this.info(`Time: ${(Date.now() - this.startTime) / 1000}s`)
    })
    this.serverProcess.on('error', (err) => {
      this.error('server error:', err);
    });
    if(stdout) {
      this.serverProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
    }
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
      if(config.requests.length === 0) {
        this.error("No benchmark matched!");
      }
      config.amount = config.requests.length * parseInt(connections);
      this.info("load test started...");
      const instance = autocannon(config);
      autocannon.track(instance, {
      onResponse: async (client, statusCode, resBytes, context, ee, next) => {
        console.log('Response status code:', statusCode);
        next();
      }
      });
      instance.on('done', async (result) => {
        const outDir = "storage/reports/performance/" + version;
        await exec("mkdir -p " + outDir);
        fs.writeFileSync(path.join(outDir, Date.now() + ".json"), JSON.stringify(result, null, 2));
        this.info("clearing database...");
        await DB.reset();
        this.success("Test report saved at /storage/reports/performance");
      });
    }
  }
  
  private async parseBenchmarks(version: string) {
    global.base = base;
    const requests = [];
    const endpointPathPair = generateEndpointsFromDirTree(path.join(this.benchmarkRootPath, version));
    for(const [endpoint, path] of Object.entries(endpointPathPair)){
     if(this.params.path && endpoint !== this.params.path) continue
      const benchmarkFile = require(path);
      for(const method in benchmarkFile) {
        const doc = benchmarkFile[method];
        let context = {}; 
        const request = doc.benchmark;
        if(!request) continue;
        if(doc.auth) {
          context.user = await this.getUser(doc);
          request.headers = {
            "authorization": "Bearer " + context.user.createToken(),
            "content-type": "application/json"
          }
        }
        Object.assign(context, await request.setupContext?.apply(context));
        let resolvedEndpoint = endpoint;
        if(endpoint.includes("{")){
          if(!request.params) this.error(`param() method is required in benchmark ${path}`)
          const params = await request.params.apply(context);
          resolvedEndpoint = endpoint.replace(/\{(\w+)\}/g, (match: string, key: string) => {
            const value = params[key];
            if(!value) this.error(`The "${key}" param is required in benchmark ${path}`);
            return value;
          });
        }
        request.path = "/api/" + version + resolvedEndpoint;
        request.method = method.toUpperCase();
        if(request.setupRequest) {
          request.setupRequest = request.setupRequest?.bind(context);
        }
        /*
        request.onResponse = (status, body) => {
          if(status > 399){
            this.error(`${request.method} -> ${request.path} \n STATUS: ${status} \n BODY: ${body}`);
          }
          console.log(`${request.method} -> ${request.path} -> STATUS: ${status}`);
        }
        */
        requests.push(request);
      }
    }
    return requests;
  }
  
  private async getUser(doc: object) {
    if(doc.cached === false)
      return await User.factory().create({ role: doc.auth });
    if(!this.cachedUsers[doc.auth])
      this.cachedUsers[doc.auth] = await User.factory().create({ role: doc.auth });
    return this.cachedUsers[doc.auth];
  }
}