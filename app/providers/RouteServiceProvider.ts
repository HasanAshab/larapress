import ServiceProvider from "~/core/abstract/ServiceProvider";
import express from "express";
import { middleware, getVersions, generateEndpoints } from "~/core/utils";
import { globalMiddlewares } from "~/app/http/kernel"
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import formDataParser from "express-fileupload";
import URL from "URL";

export default class RouteServiceProvider extends ServiceProvider {
  async boot() {
    if(this.app.runningInConsole())
      return;
    
    URL.register({
      "email.verify": "api/v1/auth/verify/:id/:token",
      "file.serve": "api/files/:path",
    });
    
    this.registerSecurityMiddlewares();
    this.registerRequestPayloadParsers();
    this.registerGlobalMiddlewares();
    this.discoverRoutes();
    this.serveStaticFolder();
    this.registerErrorHandlers();
  }
  
  private registerSecurityMiddlewares() {
    this.app.http.use(cors({
      origin: [URL.client()] 
    }));
    this.app.http.use(helmet());
  }
  
  private registerRequestPayloadParsers() {
    this.app.http.use(bodyParser.json({ limit: "1mb" }));
    this.app.http.use(bodyParser.urlencoded({
      extended: false,
      limit: "1mb"
    }));
    this.app.http.use(formDataParser());
  }
  
  private registerGlobalMiddlewares() {
    getVersions().forEach(version => {
      const middlewares = middleware(version, globalMiddlewares);
      this.app.http.use(`/api/${version}/*`, ...middlewares);
    });
  }
  
  private serveStaticFolder() {
    this.app.http.use("/api/files", express.static(__dirname + "/../storage/public"));
  }
  
  private registerErrorHandlers() {
    getVersions().forEach(version => {
      const middlewares = middleware(version, ["global.responser", "error.handle"]);
      this.app.http.use(`/api/${version}/*`, ...middlewares);
    });
  }
  
  private discoverRoutes() {
    const routesEndpointPaths = generateEndpoints("routes");
    for(const [endpoint, path] of Object.entries(routesEndpointPaths)) {
      this.app.http.use("/api" + endpoint, require(path).default);
    }
  }
}