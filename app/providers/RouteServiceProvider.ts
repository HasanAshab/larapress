import ServiceProvider from "~/core/abstract/ServiceProvider";
import express from "express";
import { middleware, generateEndpoints } from "~/core/utils";
import { globalMiddlewares } from "~/app/http/kernel"
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import formDataParser from "express-fileupload";
import URL from "URL";

export default class RouteServiceProvider extends ServiceProvider {
  boot() {
    this.registerSecurityMiddlewares();
    this.registerRequestPayloadParsers();
    this.registerGlobalMiddlewares();
    this.discoverRoutes();
    this.serveStaticFolder();
  }
  
  private registerSecurityMiddlewares() {
    this.app.use(cors({
      origin: [URL.client()] 
    }));
    this.app.use(helmet());
  }
  
  private registerRequestPayloadParsers() {
    this.app.use(bodyParser.json({ limit: "1mb" }));
    this.app.use(bodyParser.urlencoded({
      extended: false,
      limit: "1mb"
    }));
    this.app.use(formDataParser());

  }
  
  private registerGlobalMiddlewares() {
    this.app.use(middleware(...globalMiddlewares));
  }
  
  private serveStaticFolder() {
    this.app.use("/api/files", express.static(__dirname + "/../storage/public"));
  }
  
  private discoverRoutes() {
    const routesEndpointPaths = generateEndpoints("routes");
    for(const [endpoint, path] of Object.entries(routesEndpointPaths)) {
      this.app.use("/api" + endpoint, require(path).default);
    }
  }
}