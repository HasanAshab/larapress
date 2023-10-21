import { join } from "path";
import { Router as ExpressRouter } from "express";
import URL from "URL"

class RouterOptions {
  constructor(private readonly stackIndex: number) {
    this.stackIndex = stackIndex;
  }
  
  middleware(...aliases: string[]) {
    Router.$stack[this.stackIndex].middlewares.push(...aliases);
    return this;
  }
  
  name(routeName: string){
    URL.add(Router.$config.as + routeName, Router.$stack[this.stackIndex].path);
    return this;
  }
}

export default class Router {
  static $config = {
    prefix: "/",
    as: "",
    controller: null,
    middlewares: []
  }
  
  static $stack = [];

  static $add(method: string, endpoint: string, metadata) {
    const path = join(Router.$config.prefix, endpoint);
    if(typeof metadata === "string") {
      if(!Router.$config.controller)
        throw new Error(`Must pass a controller in "${endpoint}" route as no global controller exist`);
      metadata = [Router.$config.controller, metadata];
    }
    Router.$stack.push({ 
      method,
      path,
      metadata,
      middlewares: Router.$config.middlewares
    });
    return new RouterOptions(Router.$stack.length - 1);
  }
  
  static get<T extends typeof Controller>(endpoint: string, metadata: [T, keyof T]) {
    return this.$add("get", endpoint, metadata);
  }
  
  static post<T extends typeof Controller>(endpoint: string, metadata: [T, keyof T]) {
    return this.$add("post", endpoint, metadata);
  }
  
  static put<T extends typeof Controller>(endpoint: string, metadata: [T, keyof T]) {
    return this.$add("put", endpoint, metadata);
  }
  
  static delete<T extends typeof Controller>(endpoint: string, metadata: [T, keyof T]) {
    return this.$add("delete", endpoint, metadata);
  }
  
  static group(config, cb) {
    const oldConfig = Router.$config;
    if(config.prefix) {
      config.prefix = join(oldConfig.prefix, config.prefix);
    }
    Object.assign(Router.$config, config);
    cb();
    Router.$config = oldConfig;
  }
  
  static getMiddleware(...keysWithOptions) {
    return middleware(...keysWithOptions)
  }
  
  static build() {
    const router = ExpressRouter();
    for(const { method, path, metadata, middlewares } of Router.$stack) {
      const [Controller, handlerName] = metadata;
      const controller = new Controller();
      const handler = controller[handlerName].bind(controller);
      router[method](path, this.getMiddleware(...middlewares), handler);
    }
    return router;
  }
}
