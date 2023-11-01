import ServiceProvider from "~/core/abstract/ServiceProvider";
import express from "express";
import swaggerUi from "swagger-ui-express";
import docData from "~/docs/data";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import formDataParser from "express-fileupload";
import URL from "URL";
import Router from "Router";

export default class RouteServiceProvider extends ServiceProvider {
  protected middlewareAliases = {};
  protected globalMiddlewares = [];

  /**
   * Whether API documentation should be served
  */
  protected serveApiDoc = env("NODE_ENV") === "development";
  
  boot() {
    if(this.app.runningInConsole())
      return;
    if(this.serveApiDoc) {
      this.serveDocs();
    }
    Router.registerMiddleware(this.middlewareAliases);
    this.registerSecurityMiddlewares();
    this.registerRequestPayloadParsers();
    this.registerGlobalMiddlewares();
    this.registerRoutes();
    this.app.http.use("/", Router.build());
    this.serveStaticFolder();
    this.registerErrorHandlers();
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
    const middlewares = Router.resolveMiddleware(...this.globalMiddlewares);
    this.app.http.use(...middlewares);
  }
  
  private serveStaticFolder() {
    this.app.http.use("/api/files", express.static(__dirname + "/../storage/public"));
    URL.add("file.serve", "api/files/:path");
  }
  
  private registerErrorHandlers() {
    const middlewares = Router.resolveMiddleware("global.responser", "error.handle");
    this.app.http.use(...middlewares);
  }
}