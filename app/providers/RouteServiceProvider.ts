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
    if(this.app.runningInWeb()) {
      console.log("yeeh")
      this.registerSecurityMiddlewares();
      this.registerRequestPayloadParsers();
      this.registerGlobalMiddlewares();
      this.discoverRoutes();
      this.serveStaticFolder();
    }
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
    this.app.http.use(middleware(...globalMiddlewares));
  }
  
  private serveStaticFolder() {
    this.app.http.use("/api/files", express.static(__dirname + "/../storage/public"));
  }
  
  private discoverRoutes() {
    const routesEndpointPaths = generateEndpoints("routes");
    for(const [endpoint, path] of Object.entries(routesEndpointPaths)) {
      this.app.http.use("/api" + endpoint, require(path).default);
    }
  }
}