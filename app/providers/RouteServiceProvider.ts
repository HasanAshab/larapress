import ServiceProvider from "~/core/abstract/ServiceProvider";
import express from "express";
import { middleware, generateEndpoints } from "~/core/utils";
import { globalMiddlewares } from "~/app/http/kernel"
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import formDataParser from "express-fileupload";
import URL from "URL";
import Router from "Router";

export default class RouteServiceProvider extends ServiceProvider {
  boot() {
    if(this.app.runningInConsole())
      return;
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
    for(version in globalMiddlewares) {
      const middlewares = middleware(globalMiddlewares[version]);
      this.app.http.use(`/api/${version}/*`, ...middlewares);
    }
  }
  
  private serveStaticFolder() {
    this.app.http.use("/api/files", express.static(__dirname + "/../storage/public"));
    URL.add("file.serve", "api/files/:path");
  }
  
  private registerErrorHandlers() {
    const middlewares = middleware("global.responser", "error.handle");
    this.app.http.all(...middlewares);
  }
  
  private discoverRoutes() {
    const routesEndpointPaths = generateEndpoints("routes");
    for(const [endpoint, path] of Object.entries(routesEndpointPaths)) {
      Router.setup(endpoint.split("/")[2], endpoint);
      require(path);
    }
    this.app.http.use("/", Router.build());
  }
}