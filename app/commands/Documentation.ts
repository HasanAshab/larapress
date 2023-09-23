import Command from "~/core/abstract/Command";
import URL from "URL"
import { exec } from "child_process";
import app from "~/main/app";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import { generateEndpointsFromDirTree } from "helpers";

export default class Documentation extends Command {
  private outputDir = "docs/public";
  private baseUrl = URL.resolve("docs");
  private docs: Record<string, Record<string, any>>;

  async generate() {
    this.docs = require("~/docs/parse");
    this.info("starting server...");
    this.setupServer();
    for (const version of Object.keys(this.docs)){
      this.info(`******\t${version.toUpperCase()}\t******`);
      await exec("mkdir -p " + "/docs/public/" + version)
      this.info("fetching index.html...");
      const response = await fetch(`${this.baseUrl}/${version}/docs`);
      const html = await response.text();
      fs.writeFileSync(`${this.outputDir}/${version}/index.html`, html);
      const regex = /(?:href|src)="([^"]+\.(?:css|js|png|gif|jpg|jpeg|svg|ico))"/g;
      const matches = [...html.matchAll(regex)];
      this.info("fetching static files...");
      const staticfileNames = matches.map((match) => match[1].replace("./", ""));
      await this.fetchStaticFiles(version, staticfileNames);
    }
    this.success(`API Documentation generated on ${this.outputDir}`);
  }
  private async fetchStaticFiles(version: string, staticfileNames: string[]) {
    for (const name of staticfileNames) {
      this.info(`fetching ${name}...`);
      const response = await fetch(`${this.baseUrl}/${version}/${name}`);
      const html = await response.text();
      await fs.promises.writeFile(`${this.outputDir}/${version}/${name}`, html);
    }
  }
  private setupServer() {
    for (const [version, doc] of Object.entries(this.docs)){
      app.use(`/docs/${version}`, swaggerUi.serve, swaggerUi.setup(doc));
    }
    const server = app.listen(8000, () => {
      this.info("server started...");
    });
  }
  
  async uncovered() {
    const eps = this.getAllEndpoints();
    const docsTree = generateEndpointsFromDirTree("docs/parts");
    for(const [pathRegex, methods] of eps) {
      for(const documentedPath in docsTree){
        console.log(pathRegex.test(documentedPath))
        pathRegex.test(documentedPath) && eps.delete()
      }
    }
    console.log(eps)
    this.success()
  }
  
  private getAllEndpoints() {
    const endpoints = new Map();
    const traverse = (layer, parentPath = '') => {
      if (layer.route) {
        const regex = new RegExp(parentPath + layer.route.path)
        const methods = Object.keys(layer.route.methods);
        endpoints.set(regex, methods);
      }
      else if (layer.name === 'router' && layer.handle.stack) {
        layer.handle.stack.forEach((middleware) => {
          traverse(middleware, parentPath + layer.regexp);
        });
      }
    }
  
    app._router.stack.forEach((middleware) => {
      traverse(middleware);
    });
    return endpoints;
  }

}