import fs from "fs";
import middlewareConfig from "~/config/middleware";
import MethodInjector from "MethodInjector";
import RouteOptions from "./RouteOptions";
import type RouterConfig from "./RouterConfig";
import type Route from "./Route";
import type { Controller, InvokableController, APIResourceController } from "./controller";
import type { MiddlewareAliaseWithOrWithoutOptions } from "./middleware";
import { join } from "path";
import { model } from "mongoose";
import { cloneDeep, capitalize } from "lodash";
import { singular } from "pluralize";
import { Router as ExpressRouter, NextFunction, RequestHandler, Request, Response } from "express";


type BindingResolver = (value: string) => any | Promise<any>;

class Router {
  /**
   * Stack of route
   */
  stack: Route[] = [];
  
  request = new MethodInjector<Request>;
  response = new MethodInjector<Response>;

  /**
   * Scope based configuration
  */
  private config: RouterConfig = {
    prefix: "/",
    as: "",
    controller: null,
    middlewares: []
  };

  /**
   * Callbacks for resolve bindings 
  */
  static $resolvers: Record<string, BindingResolver> = {};
  
  /**
   * Reset scope based configuration
  */
  static $reset() {
    this.config = {
      prefix: "/",
      as: "",
      controller: null,
      middlewares: []
    };
  }

  /**
   * Add a endpoint to stack
  */
  private addRoute<T extends Controller>(method: string, path: string, action: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    const route: Route = {
      method,
      path: join(this.config.prefix, path),
      middlewares: [...this.config.middlewares],
    }
    
    if(Array.isArray(action)) {
      route.metadata = {
        controller: action[0],
        key: action[1]
      };
    }
    else if(typeof action === "string") {
      if(!this.config.controller)
        throw new Error(`Must pass a controller in "${path}" route as no global scope controller exist`);
      route.metadata = {
        controller: this.config.controller,
        key: action
      };
    }
    
    else if (typeof action === "function") {
      route.metadata = {
        controller: action,
        key: "__invoke"
      };
    }
    
    this.stack.push(route);
    return new RouteOptions(this, route);
  }
  
  
  /**
   * Add a endpoint of GET method to stack
  */
  get<T extends Controller>(path: string, action: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    return this.addRoute("get", endpoint, action);
  }
  
  post<T extends Controller>(path: string, action: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    return this.addRoute("post", endpoint, action);
  }
  
  put<T extends Controller>(path: string, action: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    return this.addRoute("put", endpoint, action);
  }

  patch<T extends Controller>(path: string, action: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    return this.addRoute("patch", endpoint, action);
  }
  
  delete<T extends Controller>(path: string, action: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    return this.addRoute("delete", endpoint, action);
  }
  
  apiResource(name: string, controller: APIResourceController) {
    this.group({
      prefix: name,
      controller,
      as: name + "."
    }, () => {
      this.get("/", "index").name("index");
      this.post("/", "store").name("store");
      this.get("/:raw" + capitalize(singular(name)), "show").name("show");
      this.put("/:id", "update").name("update");
      this.delete("/:id", "delete").name("delete");
    });
  }
  

  async resolve({ params }: Request, name: string) {
    let reqParamName = "";
    for(const key in params) {
      if(key === name || key.startsWith(name + "_")) {
        reqParamName = key;
      }
    }
    return reqParamName && this.$resolvers[reqParamName]?.(params[reqParamName]);
  }
  

  static bind(param: string, resolver: BindingResolver) {
    this.$resolvers[param] = resolver;
  }
  
  static model(param: string, modelName: string, queryCustomizer?: Function) {
    const Model = model(modelName);
    
    const bindField = (field: string, suffix = "") => {
      this.bind(param + suffix, value => {
        let query = Model.findOneOrFail({ [field]: value });
        if(queryCustomizer) {
          query = queryCustomizer(query);
        }
        return query.exec();
      });
    }
    
    Object.keys(Model.schema.paths).forEach(field => bindField(field, "_" + field));
    bindField("_id");
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
    const oldConfig = cloneDeep(this.config);
    if(config.prefix)
      config.prefix = join(oldConfig.prefix, config.prefix);
    if(config.as)
      config.as = oldConfig.as + config.as;
    
    Object.assign(this.config, config);
    typeof cb === "string" ? require(cb) : cb();
    this.config = oldConfig;
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
  
  static controller(ControllerClass: Controller) {
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
  

  static build(router = ExpressRouter()) {
    router.use((req, res, next) => {
      Router.request.inject(req);
      Router.response.inject(res);
      next();
    });
    
    for(const { method, path, metadata, middlewares } of this.stack) {
      const { controller, key, name } = metadata;
      const controllerInstance = resolve<any>(controller);
      
      if(typeof controllerInstance[key] !== "function")
        throw new Error(`${key} handler doesn't exist on ${Controller.name}`);
      
      const appendRequestHelpers = req => {
        req.routeName = name;
        
        req.routeIs = function(name: string | RegExp) {
          return (typeof name === "string" && name === this.routeName)
            || (name instanceof RegExp && name.test(this.routeName));
        }
        return req;
      }
      
      const requestHandler = async function(req: Request, res: Response, next: NextFunction) {
        try {
          req = appendRequestHelpers(req);
          const result = await controllerInstance[key](req, res, next);
          if(!res.headersSent) {
            if(!result) {
              res.end();
            }
            else if(typeof result === "string") {
              res.message(result)
            }
            else {
              res.json(result);
            }
          }
        }
        catch(err) {
          next(err);
        }
      }
      router[method](path, Router.resolveMiddleware(...middlewares), requestHandler);
    }
    return router;
  }
}

export default new Router;