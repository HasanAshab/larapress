import Command from "illuminate/commands/Command";
import { base, storage, generateEndpointsFromDirTree } from "helpers";
import autocannon from "autocannon";
import URL from "illuminate/utils/URL";
import app from "main/app";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

export default class TestPerformance extends Command {
  private benchmarkRootPath = base("docs/parts");

  handle() {
    app.listen(8000, () => {
      this.info("server started...");
      this.setupEnv();
      this.runLoadTest();
    });
  }

  private async runLoadTest(){
    const { connections = 10, duration = 60, amount, worker = 4 } = this.params
    const config = {
      url: URL.resolve(),
      worker,
      connections,
      duration,
      amount
    };
    this.info("load test started...");
    const versions = fs.readdirSync(this.benchmarkRootPath);
    for (const version of versions) {
      config.requests = this.parseBenchmarks(version);
      const result = await autocannon(config);
      fs.writeFileSync(storage(`reports/performance/${version}/${Date.now()}.json`), JSON.stringify(result, null, 2));
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
        console.log(request)
        requests.push(request);
      }
    }
    return requests;
  }
}