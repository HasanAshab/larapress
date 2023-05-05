const Command = require(base("illuminate/commands/Command"));
const app = require(base("main/app"));
const fs = require("fs");
const http = require("http");
const swaggerUi = require("swagger-ui-express");
const doc = require(base("doc/parse"));

class GenerateDoc extends Command {
  async handle() {
    this.alert("starting server...");
    this._setupServer();
    this.outputDir = base('/doc/public');
    this.baseUrl = "http://127.0.0.1:8000/docs";
    this._loadDir(this.outputDir);
    this.alert('fetching index.html...');
    const response = await fetch(`${this.baseUrl}/docs`);
    const html = await response.text();
    fs.writeFileSync(`${this.outputDir}/index.html`, html);
    const regex =
      /(?:href|src)="([^"]+\.(?:css|js|png|gif|jpg|jpeg|svg|ico))"/g;
    const matches = [...html.matchAll(regex)];
    this.staticfileNames = matches.map((match) => match[1].replace("./", ""));
    this.alert('fetching static files...');
    await this._fetchStaticFiles();
    this.success(`API Documentation generated on ${this.params.output}`);
  }

  async _fetchStaticFiles() {
    for (const name of this.staticfileNames) {
      this.alert(`fetching ${name}...`);
      const response = await fetch(`${this.baseUrl}/${name}`);
      const html = await response.text();
      fs.writeFileSync(`${this.outputDir}/${name}`, html);
    }
  }

  _loadDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  _setupServer() {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(doc));
    const server = app.listen(8000, () => {
      this.alert("server started...");
    });
  }
}

module.exports = GenerateDoc;
