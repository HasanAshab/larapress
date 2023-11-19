import { cloneDeep } from "lodash";
import { constructor } from "types";
import fs from "fs";
import { join } from "path";
import { Router as ExpressRouter, NextFunction, RequestHandler, Request, Response } from "express";
import { Model } from "mongoose";
import middlewareConfig from "~/config/middleware";

export type MiddlewareAliase = keyof typeof middlewareConfig["aliases"];
export type MiddlewareAliaseWithOptions = `${MiddlewareAliase}:${string}`;
export type MiddlewareAliaseWithOrWithoutOptions = MiddlewareAliase | MiddlewareAliaseWithOptions;

type RequestMethod = "get" | "post" | "put" | "patch" | "delete";
type BindingResolver = (value: string) => any | Promise<any>;
type InvokableController = constructor<{ __invoke(...args: any[]): any | Promise<any> }>;

interface Endpoint {
  /**
   * Request method of the endpoint
  */
  method: RequestMethod;
  path: string;
  metadata: [constructor | InvokableController, string];
  middlewares: MiddlewareAliaseWithOrWithoutOptions[];
}

interface RouterConfig {
  prefix: string;
  as: string;
  controller: constructor | null;
  middlewares: MiddlewareAliaseWithOrWithoutOptions[];
}

class EndpointOptions {
  constructor(private readonly stackIndex: number) {
    this.stackIndex = stackIndex;
  }
  
  /**
   * Add middlewares to a endpoint
  */
  middleware(...aliases: MiddlewareAliaseWithOrWithoutOptions[]) {
    Router.$stack[this.stackIndex].middlewares.push(...aliases);
    return this;
  }
  
  /**
   * Name a endpoint
  */
  name(routeName: string) {
    Router.$namedUrls[Router.$config.as + routeName] = Router.$stack[this.stackIndex].path;
    return this;
  }
}


export default class Router {
  /**
   * Scope based configuration
  */
  static $config: RouterConfig = {
    prefix: "/",
    as: "",
    controller: null,
    middlewares: []
  };
  
  /**
   * Stack of all endpoints
  */
  static $stack: Endpoint[] = [];
  

  /**
   * Registered named url patterns
  */
  static $namedUrls: Record<string, string> = {};
  
  /**
   * Callbacks for resolve bindings 
  */
  static $resolvers: Record<string, BindingResolver> = {};
  
  /**
   * Reset scope based configuration
  */
  static $reset() {
    Router.$config = {
      prefix: "/",
      as: "",
      controller: null,
      middlewares: []
    };
  }
  
  /**
   * Add a endpoint to stack
  */
  static $add<T extends constructor>(method: RequestMethod, endpoint: string, metadata: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    const path = join(Router.$config.prefix, endpoint);
    if(typeof metadata === "string") {
      if(!Router.$config.controller)
        throw new Error(`Must pass a controller in "${endpoint}" route as no global scope controller exist`);
      metadata = [Router.$config.controller as T, metadata];
    }
    else if (typeof metadata === "function") {
      metadata = [metadata as T, "__invoke"];
    }
    Router.$stack.push({
      method,
      path,
      metadata,
      middlewares: [...Router.$config.middlewares]
    });
    return new EndpointOptions(Router.$stack.length - 1);
  }
  
  /**
   * Add a endpoint of GET method to stack
  */
  static get<T extends constructor>(endpoint: string, metadata: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    return this.$add("get", endpoint, metadata);
  }
  
  static post<T extends constructor>(endpoint: string, metadata: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    return this.$add("post", endpoint, metadata);
  }
  
  static put<T extends constructor>(endpoint: string, metadata: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    return this.$add("put", endpoint, metadata);
  }

  static patch<T extends constructor>(endpoint: string, metadata: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    return this.$add("patch", endpoint, metadata);
  }
  
  static delete<T extends constructor>(endpoint: string, metadata: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    return this.$add("delete", endpoint, metadata);
  }
  
  static apiResource(prefix: string, controller: constructor) {
    this.group({
      prefix,
      controller,
      as: prefix.replace("/", "") + "."
    }, () => {
      this.get("/", "index").name("index");
      this.post("/", "store").name("store");
      this.get("/:id", "show").name("show");
      this.put("/:id", "update").name("update");
      this.delete("/:id", "delete").name("delete");
    });
  }
  
  static resolve(req: Request, param: string) {
    return this.$resolvers[param]?.(req.params[param]);
  }

  static bind(param: string, resolver: BindingResolver) {
    this.$resolvers[param] = resolver;
  }
  
  static model(param: string, modelClassOrPath: string | Model<any>) {
    if(typeof modelClassOrPath === "string") {
      modelClassOrPath = require(modelClassOrPath).default;
    }
    this.bind(param, value => (modelClassOrPath as Model<any>).findByIdOrFail(value));
  }
  

  /**
    * Generates middlewares stack based on keys. Options are injected to the middleware class.
    * You can pass only keys or strings that are devided by ':'. first part is the 
    * key and second is options which is separated by ','
    *
    * Examples:
    * 
    * Router.resolveMiddleware("foo")
    * Router.resolveMiddleware("foo", "bar")
    * Router.resolveMiddleware("foo:opt1", "bar:opt1,opt2")
  */
  static resolveMiddleware(...keysWithOptions: MiddlewareAliaseWithOrWithoutOptions[]): RequestHandler[] {
    const handlers: RequestHandler[] = [];
    keysWithOptions.forEach(keyWithOptions => {
      const [key, optionString] = keyWithOptions.split(":");
      const options = optionString ? optionString.split(",") : [];
      const MiddlewareClass = require(middlewareConfig.aliases[key as MiddlewareAliase]).default;
      const middleware = new MiddlewareClass();
      const handler = async function(req: Request, res: Response, next: NextFunction) {
        try {
          await middleware.handle(req, res, next, ...options);
        }
        catch(err) {
          next(err)
        }
      }
      handlers.push(handler);
    });
    return handlers;
  }
  
  static group(config: Partial<RouterConfig>, cb: string | (() => void)) {
    const oldConfig = cloneDeep(Router.$config);
    if(config.prefix)
      config.prefix = join(oldConfig.prefix, config.prefix);
    if(config.as)
      config.as = oldConfig.as + config.as;
    
    Object.assign(Router.$config, config);
    typeof cb === "string" ? require(cb) : cb();
    Router.$config = oldConfig;
  }
  
  static prefix(path: string) {
    const group = (cb: () => void) => {
      this.group({ prefix: path }, cb);
    }
    const load = (routerPath: string) => {
      this.group({ prefix: path }, routerPath);
    }
    return { group, load };
  }
  
  static prefixName(as: string) {
    const group = (cb: () => void) => {
      this.group({ as }, cb);
    }
    
    const load = (routerPath: string) => {
      this.group({ as }, routerPath);
    }
    return { group, load };
  }
  
  static controller(ControllerClass: constructor) {
    const group = (cb: () => void) => {
      this.group({ controller: ControllerClass }, cb);
    }
    
    const load = (routerPath: string) => {
      this.group({ controller: ControllerClass }, routerPath);
    }
    return { group, load };
  }
  
  static middleware(aliases: MiddlewareAliaseWithOrWithoutOptions | MiddlewareAliaseWithOrWithoutOptions[]) {
    aliases = typeof aliases === "string" ? [aliases] : aliases;
    const group = (cb: () => void) => {
      this.group({ middlewares: aliases as MiddlewareAliaseWithOrWithoutOptions[] }, cb);
    }
    
    const load = (routerPath: string) => {
      this.group({ middlewares: aliases as MiddlewareAliaseWithOrWithoutOptions[] }, routerPath);
    }
    return { group, load };
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
      const controller = resolve<any>(Controller);
      const handler = controller[handlerName].bind(controller);
      router[method](path, Router.resolveMiddleware(...middlewares), handler);
    }
    return router;
  }
}