import ServiceProvider from "~/core/providers/ServiceProvider";
import { container } from "tsyringe";
import { static as serveStatic, Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import helmet from "helmet";
import { modelNames } from "mongoose";
import { lowerFirst } from "lodash-es";
import { getStatusText } from "http-status-codes";
import bodyParser from "body-parser";
import formDataParser from "express-fileupload";
import URL from "URL";
import Router from "./Router";
import MiddlewareManager from "./MiddlewareManager";
import middlewareConfig from "~/config/middleware";
import type { MiddlewareAliaseWithOrWithoutOptions } from "./middleware";
import ExceptionHandler from "~/app/exceptions/Handler";
import JsonResource from "~/core/http/resources/JsonResource";
import ResourceCollection from "~/core/http/resources/ResourceCollection";

export default abstract class RouteServiceProvider extends ServiceProvider {
  protected router!: Router;

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
   * Register route service
   */
  async register() {
    const middlewareManager = await MiddlewareManager.create(middlewareConfig);
    this.router = new Router(this.app.http, middlewareManager);
    
    container.register(Router, { useValue: this.router });
  }
  
  /**
   * Boot route services
  */
  async boot() {
    if(!this.app.runningInWeb()) return;
    
    this.serveApiDoc && await this.serveDocs();
    
    this.registerSecurityMiddlewares();
    this.registerRequestPayloadParsers();
    await this.registerGlobalMiddlewares();
    this.bindModelsImplicitly && this.bindModels();
    this.customizeHttp();
    await this.setupRoutes();
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
  protected async serveDocs() {
    this.app.assertRunningInWeb();
    const data = await import("~/docs/data.json", { assert: { type: "json" } });
    this.app.http.use("/docs", swaggerUi.serve, swaggerUi.setup(data));
  }
  
  
  /**
   * Register middlewares for parsing incoming request payload
  */
  protected registerRequestPayloadParsers() {
    this.app.assertRunningInWeb();
    this.app.http.use(bodyParser.json({ limit: "1mb" }));
    this.app.http.use(formDataParser());
    this.app.http.use(bodyParser.urlencoded({
      extended: false,
      limit: "1mb"
    }));
  }
  
  /**
   * Register version specefic global middlewares.
  */
  protected async registerGlobalMiddlewares() {
    this.app.assertRunningInWeb();
    const middlewares = this.router.middleware.get(this.globalMiddlewares);
    this.app.http.use(...middlewares);
  }
  
  
  protected bindModels() {
    modelNames().forEach(modelName => {
      this.router.model(lowerFirst(modelName), modelName);
      this.router.model("raw" + modelName, modelName, query => query.lean());
    });
  }
  
  /**
   * Register routes to express
   */
  protected abstract registerRoutes(): void | Promise<void>;
  
  /**
   * Inject and customize http helpers
   */
  protected customizeHttp() {
    this.router.request.method("file", function(name: string) {
      return this.files?.[name] ?? null;
    });
    
    this.router.request.method("hasFile", function(name: string) {
      return !!this.file(name);
    });
    
    this.router.request.getter("fullUrl", function() {
      return this.protocol + '://' + this.get('host') + this.originalUrl;
    });
    
    this.router.request.getter("fullPath", function() {
      return this.protocol + '://' + this.get('host') + this.path;
    });
   
    this.router.request.getter("hasValidSignature", function() {
      if(!this._hasValidSignature) {
        this._hasValidSignature = URL.hasValidSignature(this.fullUrl);
      }
      return this._hasValidSignature;
    });
    
    this.router.response.method("json", function(data: string | object) {
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
    
    this.router.response.method("sendStatus", function(code: number) {
      this.status(code).json({});
    });
    
    this.router.response.method("message", function(text?: string) {
      this.json({
        success: this.statusCode >= 200 && this.statusCode < 300,
        message: text || getStatusText(this.statusCode),
      });
    });
    
    this.router.response.method("redirectToClient", function(path = '/') {
      this.redirect(URL.client(path));
    });
    
    this.router.response.method("sendFileFromStorage", function(storagePath: string) {
      this.sendFile(base("storage", storagePath));
    });
  }

  /**
   * Setup express routes
   */
  protected async setupRoutes() {
    this.app.assertRunningInWeb();
    await this.registerRoutes();
    this.router.build(this.app.http)
  }
  
  /**
   * Serve a folder publicly
  */
  protected serveStaticFolder() {
    this.app.assertRunningInWeb();
    this.app.http.use("/api/files", serveStatic(base("storage/public")));
    URL.add("file.serve", "api/files/:path");
  }
  
  /**
   * Register http error handlers
  */
  protected registerErrorHandler() {
    this.app.assertRunningInWeb();
    const exceptionHandler = new ExceptionHandler();
    this.app.http.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
      await exceptionHandler.handle(err, req, res);
    });
  }
}