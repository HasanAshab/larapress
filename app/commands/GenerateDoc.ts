import {
  base
} from "helpers";
import { loadDir } from "illuminate/utils";
import Command from "illuminate/commands/Command";
import app from "main/app";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import doc from "docs/parse";


export default class GenerateDoc extends Command {
  async handle() {
    this.info("starting server...");
    this._setupServer();
    this.outputDir = base('/docs/public');
    this.baseUrl = "http://127.0.0.1:8000/docs";
    loadDir(this.outputDir);
    this.info('fetching index.html...');
    const response = await fetch(`${this.baseUrl}/docs`);
    const html = await response.text();
    fs.writeFileSync(`${this.outputDir}/index.html`, html);
    const regex =
      /(?:href|src)="([^"]+\.(?:css|js|png|gif|jpg|jpeg|svg|ico))"/g;
    const matches = [...html.matchAll(regex)];
    this.staticfileNames = matches.map((match) => match[1].replace("./", ""));
    this.info('fetching static files...');
    await this._fetchStaticFiles();
    this.success(`API Documentation generated on ${this.outputDir}`);
  }

  async _fetchStaticFiles() {
    for (const name of this.staticfileNames) {
      this.info(`fetching ${name}...`);
      const response = await fetch(`${this.baseUrl}/${name}`);
      const html = await response.text();
      fs.writeFileSync(`${this.outputDir}/${name}`, html);
    }
  }
  
  _setupServer() {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(doc));
    const server = app.listen(8000, () => {
      this.info("server started...");
    });
  }
}