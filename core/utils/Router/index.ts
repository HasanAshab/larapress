import _ from "lodash";
import fs from "fs";
import { join } from "path";
import { Router as ExpressRouter, NextFunction, RequestHandler, Request, Response } from "express";

class EndpointOptions {
  constructor(private readonly stackIndex: number) {
    this.stackIndex = stackIndex;
  }

  middleware(...aliases: keyof typeof middlewareAliases[]) {
    Router.$stack[this.stackIndex].middlewares.push(...aliases);
    return this;
  }
  
  name(routeName: string) {
    Router.$namedUrls[Router.$config.as + routeName] = Router.$stack[this.stackIndex].path;
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
  static $middlewareAliases = {};
  static $namedUrls = {};
  static $bindings = {};

  static $reset() {
    Router.$config = {
      prefix: "/",
      as: "",
      controller: null,
      middlewares: []
    };
  }
  
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
      middlewares: [...Router.$config.middlewares]
    });
    return new EndpointOptions(Router.$stack.length - 1);
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
  
  static apiResource(prefix: string, controller: typeof Controller) {
    this.group({
      prefix,
      controller,
      as: prefix + "."
    }, () => {
      this.get("/", "index").name("index");
      this.post("/", "create").name("create");
      this.get("/:id", "show").name("show");
      this.put("/:id", "update").name("update");
      this.delete("/:id", "delete").name("delete");
    });
  }
  
  static resolve(req: Request, param: string) {
    return this.$bindings[param]?.(req.params[param]);
  }

  static bind(param: string, resolver) {
    this.$bindings[param] = resolver;
  }
  
  static model(param: string, Model: string | Model) {
    if(typeof Model === "string") {
      Model = require(Model).default;
    }
    this.bind(param, value => Model.findByIdOrFail(value));
  }
  
  static registerMiddleware(aliases: Record<string, string>) {
    this.$middlewareAliases = aliases;
  }
  
  static addMiddleware(alias: string, path: string) {
    this.$middlewareAliases[alias] = path;
  }
  
  /**
    * Generates middlewares stack based on keys. Options are injected to the middleware class.
    * You can pass only keys or strings that are devided by ':' first part is the 
    * key and second is options separated by ','
    *
    * Examples:
    * 
    * this.resolve("foo")
    * this.resolve("foo", "bar")
    * this.resolve("foo:opt1", "bar:opt1,opt2")
  */
  static resolveMiddleware(...keysWithOptions): RequestHandler[] {
    const handlers = [];
    keysWithOptions.forEach(keyWithOptions => {
      const [key, optionString] = keyWithOptions.split(":");
      const options = optionString ? optionString.split(",") : [];
      const MiddlewareClass = require(this.$middlewareAliases[key]).default;
      const middleware = new MiddlewareClass();
      let handler: RequestHandler;
      if(middleware.errorHandler) {
        handler = function(err: any, req: Request, res: Response, next: NextFunction) {
          return middleware.handle(err, req, res, next, ...options);
        }
      }
      else {
        handler = async function(req: Request, res: Request, next: NextFunction) {
          try {
            return await middleware.handle(req, res, next, ...options);
          }
          catch(err) {
            next(err)
          }
        }
      }
      handlers.push(handler);
    });
    return handlers;
  }
  
  static group(config, cb) {
    const oldConfig = _.cloneDeep(Router.$config);
    if(config.prefix) {
      config.prefix = join(oldConfig.prefix, config.prefix);
    }
    Object.assign(Router.$config, config);
    cb();
    Router.$config = oldConfig;
  }
  
  static prefix(path: string) {
    const group = (cb) => {
      this.group({ prefix: path }, cb);
    }
    return { group };
  }
  
  static name(as: string) {
    const group = (cb) => {
      this.group({ as }, cb);
    }
    return { group };
  }
  
  static controller(ControllerClass: typeof Controller) {
    const group = (cb) => {
      this.group({ controller: ControllerClass }, cb);
    }
    return { group };
  }
  
  static middleware(aliases: string | string[]) {
    aliases = typeof aliases === "string" ? [aliases] : aliases;
    const group = (cb) => {
      this.group({ middlewares: aliases}, cb);
    }
    return { group };
  }
  
  /**
   * Discovers routes from a base directory and prefix its endpoints.
   * Used for a simple File Based Routing.
  */
  static discover(base = "routes") {
    const endpointPathPair: Record<string, string> = {}
    const stack = [base];
    while (stack.length > 0) {
      const currentPath = stack.pop();
      if (!currentPath) break;
      const items = fs.readdirSync(currentPath);
      for (const item of items) {
        const itemPath = join(currentPath, item);
        const status = fs.statSync(itemPath);
        if (status.isFile()) {
          const itemPathEndpoint = itemPath.replace(base, "").split(".")[0].toLowerCase().replace(/index$/, "");
          Router.$reset();
          Router.prefix(itemPathEndpoint).group(() => {
            require("~/" + itemPath.split(".")[0])
          });
        }
        else if (status.isDirectory()) {
          stack.push(itemPath);
        }
      }
    }
    Router.$reset();
  }
  

  static build() {
    const router = ExpressRouter();
    for(const { method, path, metadata, middlewares } of Router.$stack) {
      const [Controller, handlerName] = metadata;
      const controller = new Controller();
      const handler = controller[handlerName].bind(controller);
      router[method](path, Router.resolveMiddleware(...middlewares), handler);
    }
    return router;
  }
}