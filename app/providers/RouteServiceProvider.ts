import ServiceProvider from "~/core/abstract/ServiceProvider";
import express from "express";
import { middleware, generateEndpoints } from "~/core/utils";
import { globalMiddlewares } from "~/app/http/kernel"
import authRouter from "~/routes/v1/auth";

export default class RouteServiceProvider extends ServiceProvider {
  boot() {
    this.registerGlobalMiddlewares();
    this.serveStaticFolder();
    //this.discoverRoutes();
    this.app.use("/api/v1/auth", authRouter)
    
    
    this.registerErrorHandlers();
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
  
  private registerErrorHandlers() {
    this.app.use(middleware("global.responser", "error.handle"));
  }
}