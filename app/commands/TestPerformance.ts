import Command from "illuminate/commands/Command";
import { base, storage, generateEndpointsFromDirTree } from "helpers";
import autocannon from "autocannon";
import DB from "illuminate/utils/DB";
import URL from "illuminate/utils/URL";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

export default class TestPerformance extends Command {
  private benchmarkRootPath = base("docs/parts");
  async handle(){
    this.setupEnv();
    require("main");
    this.info("reseting database...");
    await DB.reset();
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
      config.requests = this.parseBenchmarks(version);
      this.info("load test started...");
      const result = await autocannon(config);
      fs.writeFileSync(storage(`reports/performance/${version}/${Date.now()}.json`), JSON.stringify(result, null, 2));
      this.info("clearing database...");
      await DB.reset();
    }
    this.success("Test report saved at /storage/reports/performance");
  }
  
  private setupEnv() {
    const testEnv = dotenv.parse(fs.readFileSync(".env.test"));
    for(const key in testEnv){
      process.env[key] = testEnv[key];
    }
  }
  
  
  private parseBenchmarks(version: string) {
    global.base = base;
    const requests = [];
    const endpointPathPair = generateEndpointsFromDirTree(path.join(this.benchmarkRootPath, version));
    for(const [endpoint, path] of Object.entries(endpointPathPair)){
      const benchmarkFile = require(path);
      for(const method in benchmarkFile) {
        const request = benchmarkFile[method].benchmark;
        if(!request) continue;
        request.method = method.toUpperCase(),
        request.path = "/api/" + version + endpoint,
        request.onResponse = (status, body, context) => {
          if(status > 399){
            this.error(`${request.method} -> ${request.path} \n ${body}`);
          }
        }
        requests.push(request);
      }
    }
    return requests;
  }
}