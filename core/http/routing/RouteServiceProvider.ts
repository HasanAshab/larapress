import ServiceProvider from "~/core/providers/ServiceProvider";
import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import helmet from "helmet";
import { modelNames } from "mongoose";
import { lowerFirst } from "lodash";
import { getStatusText } from "http-status-codes";
import bodyParser from "body-parser";
import formDataParser from "express-fileupload";
import URL from "URL";
import Router from "./Router";
import type { MiddlewareAliaseWithOrWithoutOptions } from "./middleware";
import ExceptionHandler from "~/app/exceptions/Handler";
import URL from "URL";
import JsonResource from "~/core/http/resources/JsonResource";
import ResourceCollection from "~/core/http/resources/ResourceCollection";

export default abstract class RouteServiceProvider extends ServiceProvider {
  /**
   * Whether API documentation should be served
  */
  protected serveApiDoc = env("NODE_ENV") === "development";
 
 /**
  * Whether mongoose Models should be implicitly binded to Router
  */
  protected bindModelsImplicitly = true;
  
  protected abstract globalMiddlewares: MiddlewareAliaseWithOrWithoutOptions[];
  
  /**
   * Boot route services
  */
  boot() {
    if(!this.app.runningInWeb()) return;
    this.serveApiDoc && this.serveDocs();
    
    this.registerSecurityMiddlewares();
    this.registerRequestPayloadParsers();
    this.registerGlobalMiddlewares();
    this.bindModelsImplicitly && this.bindModels();
    this.customizeHttp();
    this.setupRoutes();
    this.serveStaticFolder();
    this.registerErrorHandler();
  }
  
  /**
   * Register middlewares to securing application
  */
  protected registerSecurityMiddlewares() {
    this.app.assertRunningInWeb();
    this.app.http.use(cors({
      origin: [URL.client()] 
    }));
    this.app.http.use(helmet());
  }
  
  /**
   * Serve api documentation with swagger 
  */
  protected serveDocs() {
    this.app.assertRunningInWeb();
    this.app.http.use("/docs", swaggerUi.serve, swaggerUi.setup(require("~/docs/data")));
  }
  
  
  /**
   * Register middlewares for parsing incoming request payload
  */
  protected registerRequestPayloadParsers() {
    this.app.assertRunningInWeb();
    this.app.http.use(bodyParser.json({ limit: "1mb" }));
    this.app.http.use(bodyParser.urlencoded({
      extended: false,
      limit: "1mb"
    }));
    this.app.http.use(formDataParser());
  }
  
  /**
   * Register version specefic global middlewares.
  */
  protected registerGlobalMiddlewares() {
    this.app.assertRunningInWeb();
    const middlewares = Router.resolveMiddleware(...this.globalMiddlewares);
    this.app.http.use(...middlewares);
  }
  
  
  protected bindModels() {
    modelNames().forEach(modelName => {
      Router.model(lowerFirst(modelName), modelName);
      Router.model("raw" + modelName, modelName, query => query.lean());
    });
  }
  
  /**
   * Register routes to express
   */
  protected abstract registerRoutes(): void;
  
  /**
   * Inject and customize http helpers
   */
  protected customizeHttp() {
    Router.request.add("file", function(name: string) {
      return this.files?.[name] ?? null;
    });
    
    Router.request.add("hasFile", function(name: string) {
      return !!this.file(name);
    });
    
    Router.request.getter("fullUrl", function() {
      return this.protocol + '://' + this.get('host') + this.originalUrl;
    });
    
    Router.request.getter("fullPath", function() {
      return this.protocol + '://' + this.get('host') + this.path;
    });
   
    Router.request.getter("hasValidSignature", function() {
      if(!this._hasValidSignature) {
        this._hasValidSignature = URL.hasValidSignature(this.fullUrl);
      }
      return this._hasValidSignature;
    });
    
    Router.response.add("json", function(data: string | object) {
      if (!this.get('Content-Type')) {
        this.set('Content-Type', 'application/json');
      }
      
      if(typeof data === "string")
        return this.send(data);
        
      data = JSON.stringify(data, (key, value) => {
        if(value instanceof JsonResource || value instanceof ResourceCollection) {
          value.withResponse(this.req, this);
          return value.transform(this.req);
        }
        return value;
      });
      
      
      this.send(data);
    });
    
    Router.response.add("sendStatus", function(code: number) {
      this.status(code).json({});
    });
    
    Router.response.add("message", function(text?: string) {
      this.json({
        success: this.statusCode >= 200 && this.statusCode < 300,
        message: text || getStatusText(this.statusCode),
      });
    });
    
    Router.response.add("redirectToClient", function(path = '/') {
      this.redirect(URL.client(path));
    });
    
    Router.response.add("sendFileFromStorage", function(storagePath: string) {
      this.sendFile(base("storage", storagePath));
    });
  }

  /**
   * Register routes to express
   */
  protected setupRoutes() {
    this.registerRoutes();
    Router.build(this.app.http)
  }
  
  /**
   * Serve a folder publicly
  */
  protected serveStaticFolder() {
    this.app.assertRunningInWeb();
    this.app.http.use("/api/files", express.static(base("storage/public")));
    URL.add("file.serve", "api/files/:path");
  }
  
  /**
   * Register http error handlers
  */
  protected registerErrorHandler() {
    this.app.assertRunningInWeb();
    const exceptionHandler = new ExceptionHandler();
    this.app.http.use(async (err, req, res, next) => {
      await exceptionHandler.handle(err, req, res);
    });
  }
}