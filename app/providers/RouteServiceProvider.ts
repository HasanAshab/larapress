import ServiceProvider from "~/core/abstract/ServiceProvider";
import express from "express";
import swaggerUi from "swagger-ui-express";
import docData from "~/docs/data";
import { middleware } from "~/core/utils";
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
    this.serveDocs();
    this.registerSecurityMiddlewares();
    this.registerRequestPayloadParsers();
    this.registerGlobalMiddlewares();
    this.discoverRoutes();
    this.serveStaticFolder();
    this.registerErrorHandlers();
    
    Router.model("user", "~/app/models/User");
  }
  
  private registerSecurityMiddlewares() {
    this.app.http.use(cors({
      origin: [URL.client()] 
    }));
    this.app.http.use(helmet());
  }
  
  private serveDocs() {
    this.app.http.use("/docs", swaggerUi.serve, swaggerUi.setup(docData));
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
    for(const version in globalMiddlewares) {
      const middlewares = middleware(...globalMiddlewares[version]);
      this.app.http.use(`/api/${version}/*`, ...middlewares);
    }
  }
  
  private serveStaticFolder() {
    this.app.http.use("/api/files", express.static(__dirname + "/../storage/public"));
    URL.add("file.serve", "api/files/:path");
  }
  
  private registerErrorHandlers() {
    const middlewares = middleware("global.responser", "error.handle");
    this.app.http.use(...middlewares);
  }
  
  discoverRoutes() {
    Router.discover();
    this.app.http.use("/", Router.build());
  }
}