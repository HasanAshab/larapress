import Command from "illuminate/commands/Command";
import { base, generateEndpointsFromDirTree } from "helpers";
import { spawn } from "child_process";
import autocannon from "autocannon";
import DB from "illuminate/utils/DB";
import URL from "illuminate/utils/URL";
import User from "app/models/User";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

export default class TestPerformance extends Command {
  private benchmarkRootPath = base("docs/parts");
  async handle(){
    this.setupEnv();
    spawn('npm', ['run', 'dev'], { detached: true, stdio: 'ignore' }).unref();
    this.info("connecting to database...");
    await DB.connect();
    this.info("reseting database...");
    //await DB.reset();
    const { connections = 100, amount = 10000, worker = 5 } = this.params
    const config = {
      url: URL.resolve(),
      worker,
      connections,
      amount
    };
    const versions = fs.readdirSync(this.benchmarkRootPath);
    for (const version of versions) {
      this.info(`parsing benchmarks of ${version}...`);
      config.requests = await this.parseBenchmarks(version);
      console.log(config.requests)
      this.info("load test started...");
      //const result = await autocannon(config);
      const outDir = "storage/reports/performance/" + version;
      !fs.existsSync(outDir) && fs.mkdirSync(outDir);
      fs.writeFileSync(path.join(outDir, Date.now() + ".json"), JSON.stringify(result, null, 2));
      this.info("clearing database...");
      //await DB.reset();
    }
    this.success("Test report saved at /storage/reports/performance");
  }
  
  private setupEnv() {
    const testEnv = dotenv.parse(fs.readFileSync(".env.test"));
    for(const key in testEnv){
      process.env[key] = testEnv[key];
    }
  }
  
  
  private async parseBenchmarks(version: string) {
    global.base = base;
    const requests = [];
    const endpointPathPair = generateEndpointsFromDirTree(path.join(this.benchmarkRootPath, version));
    for(let [endpoint, path] of Object.entries(endpointPathPair)){
      if(endpoint !== "/auth/verify/{id}") continue
      const benchmarkFile = require(path);
      for(const method in benchmarkFile) {
        const doc = benchmarkFile[method];
        let context = {}; 
        const request = doc.benchmark;
        if(!request) continue;
        if("setupContext" in request){
          context = await request.setupContext();
        }
        if("auth" in doc) {
          const user = await User.factory().create({ role: doc.auth });
          context.user = user;
          request.headers = {
            "Authorization": "bearer " + user.createToken()
          }
        }
        request.setupRequest = request.setupRequest?.bind(context);
        request.params = request.params?.bind(context);
        if(endpoint.includes("{")){
          const params = await request.params();
          endpoint = endpoint.replace(/\{(\w+)\}/g, (match: string, key: string) => {
            const value = params[key];
            if(!value) this.error(`The "${key}" param is required in endpoint ${endpoint}`);
            return value;
          });
        }
        request.path = "/api/" + version + endpoint;
        request.method = method.toUpperCase();
        request.onResponse = (status, body, context) => {
          if(status > 399){
            this.error(`${request.method} -> ${request.path} \n ${body}`);
          }
        };

        requests.push(request);
      }
    }
    return requests;
  }
}