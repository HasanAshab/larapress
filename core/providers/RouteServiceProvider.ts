import ServiceProvider from "~/core/abstract/ServiceProvider";
import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import helmet from "helmet";
import { modelNames } from "mongoose";
import { lowerFirst } from "lodash";
import bodyParser from "body-parser";
import formDataParser from "express-fileupload";
import URL from "URL";
import Router, { MiddlewareAliaseWithOrWithoutOptions } from "Router";
import { getStatusText } from "http-status-codes";
import ErrorHandler from "~/app/http/middlewares/ErrorHandler";
import JsonResource from "~/core/http/resources/JsonResource";

export default abstract class RouteServiceProvider extends ServiceProvider {
  /**
   * Whether to discover routes or not
  */
  protected discoverRoutes = true;
  
  /**
   * From where routes should be discovered
  */
  protected discoverRouteFrom = "routes";
  
  
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
    this.appendHelpers();
    this.registerGlobalMiddlewares();
    this.bindModelsImplicitly && this.bindModels();
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
  
  protected appendHelpers() {
    this.app.http.use((req, res, next) => {
      req.files = {};
  
      Object.defineProperty(req, 'fullUrl', {
        get: function() {
          return this.protocol + '://' + this.get('host') + this.originalUrl;
        }
      });
    
      Object.defineProperty(req, 'hasValidSignature', {
        get: function() {
          return URL.hasValidSignature(this.fullUrl);
        }
      });

      res.json = function(obj: object) {
        const data = JSON.stringify(obj, (key, value) => {
          if(value instanceof JsonResource) {
            const resource = value.toObject(req);
            return key
              ? resource
              : { [value.wrap]: resource };
          }
          return value
        });

        
        this.send(data); 
      }
 
      res.message = function(text?: string) {
        this.json({
          success: this.statusCode >= 200 && this.statusCode < 300,
          message: text || getStatusText(this.statusCode),
        });
      };
    
      res.api = function(response: RawResponse) {
        response.success = this.statusCode >= 200 && this.statusCode < 300
        response.message = response.message ?? getStatusText(this.statusCode);
        response.data = response.data ?? {...response};
        
        this.json(response);
      };
    
      res.redirectToClient = function(path = '/') {
        this.redirect(URL.client(path));
      };
    
      res.sendFileFromStorage = function(storagePath: string) {
        this.sendFile(base("storage", storagePath));
      };
      next();
    });
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
  
  protected registerRoutes() {
    //
  }

  /**
   * Register routes to express
   */
  protected setupRoutes() {
    this.discoverRoutes
      ? Router.discover(this.discoverRoutesFrom)
      : this.registerRoutes();
    this.app.http.use("/", Router.build());
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
    const errorHandler = new ErrorHandler();
    const handler = errorHandler.handle.bind(errorHandler);
    this.app.http.use(handler);
  }
}