import type RouterConfig from "./RouterConfig";
import type Route from "./Route";
import type { Controller, InvokableController, APIResourceController } from "./controller";
import type { MiddlewareAliase, MiddlewareAliaseWithOrWithoutOptions } from "./middleware";
import { Router as ExpressRouter, NextFunction, RequestHandler, Request, Response } from "express";
import fs from "fs";
import type { Express } from "express";
import middlewareConfig from "~/config/middleware";
import MethodInjector from "MethodInjector";
import RouteOptions from "./RouteOptions";
import { join } from "path";
import { model, Query } from "mongoose";
import { cloneDeep, capitalize } from "lodash-es";
import pluralize from "pluralize";


export type BindingResolver = (value: string) => any | Promise<any>;
export type RouterCallback = () => void | Promise<void>;

export class Router<MiddlewareAliases> {
  /**
   * Stack of registered routes
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
  private resolvers: Record<string, BindingResolver> = {};
  
  private fallbackHandler: RequestHandler = (req: Request, res: Response) => res.status(404).json();
  
  /**
   * Reset scope based configuration
  */
  reset() {
    this.config = {
      prefix: "/",
      as: "",
      controller: null,
      middlewares: []
    };
  }
  
  fallback(handler: RequestHandler) {
    this.fallbackHandler = handler;
  }
  
  /**
   * Add a route to stack
   */
  private addRoute<T extends Controller>(method: string, path: string, action: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    const route: Route = {
      method,
      path: join(this.config.prefix, path),
      middlewares: [...this.config.middlewares],
      metadata: {} as any
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
    return new RouteOptions(this.config, route);
  }
  
  
  /**
   * Add a route of GET method to stack
  */
  get<T extends Controller>(path: string, action: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    return this.addRoute("get", path, action);
  }
  
  post<T extends Controller>(path: string, action: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    return this.addRoute("post", path, action);
  }
  
  put<T extends Controller>(path: string, action: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    return this.addRoute("put", path, action);
  }

  patch<T extends Controller>(path: string, action: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    return this.addRoute("patch", path, action);
  }
  
  delete<T extends Controller>(path: string, action: string | InvokableController | [T, keyof InstanceType<T> & string]) {
    return this.addRoute("delete", path, action);
  }
  
  apiResource(name: string, controller: APIResourceController) {
    return this.group({
      prefix: name,
      controller,
      as: name + "."
    }, () => {
      this.get("/", "index").name("index");
      this.post("/", "store").name("store");
      this.get("/:raw" + capitalize(pluralize.singular(name)), "show").name("show");
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
    return await this.resolvers[reqParamName]?.(params[name])
      ?? params[name];
  }
  

  bind(param: string, resolver: BindingResolver) {
    this.resolvers[param] = resolver;
  }
  
  model(param: string, modelName: string, queryCustomizer?: ((query: Query<Document, Document>) => any)) {
    const Model = model(modelName);
    const bindField = (field: string, suffix = "") => {
      this.bind(param + suffix, value => {
        let query = Model.findOneOrFail({ [field]: value });
        queryCustomizer?.(query);
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
    * this.resolveMiddleware("foo")
    * this.resolveMiddleware("foo", "bar")
    * this.resolveMiddleware("foo:opt1", "bar:opt1,opt2")
  */
  resolveMiddleware(...keysWithOptions: MiddlewareAliaseWithOrWithoutOptions[]): Promise<RequestHandler[]> {
    const promises = keysWithOptions.map(async keyWithOptions => {
      const [key, optionString] = keyWithOptions.split(":");
      const options = optionString ? optionString.split(",") : [];
      const path = middlewareConfig.aliases[key as keyof MiddlewareAliase];
      const MiddlewareClass = await importDefault<constructor>(path);
      const middleware = new MiddlewareClass();
      return async function(req: Request, res: Response, next: NextFunction) {
        try {
          await middleware.handle(req, res, next, ...options);
        }
        catch(err) {
          next(err)
        }
      }
    });
    
    return Promise.all(promises);
  }
  
  async group(config: Partial<RouterConfig>, cb: string | RouterCallback) {
    const oldConfig = cloneDeep(this.config);
    
    if(config.prefix) {
      config.prefix = join(oldConfig.prefix, config.prefix);
    }
    if(config.as) {
      config.as = oldConfig.as + config.as;
    }
    
    Object.assign(this.config, config);

    typeof cb === "string" 
      ? await import(cb) 
      : await cb();
    
    this.config = oldConfig;
  }
  
  prefix(path: string) {
    const group = (cb: () => void) => {
      return this.group({ prefix: path }, cb);
    }
    const load = (routerPath: string) => {
      return this.group({ prefix: path }, routerPath);
    }
    return { group, load };
  }
  
  as(name: string) {
    const group = (cb: () => void) => {
      return this.group({ as: name }, cb);
    }
    
    const load = (routerPath: string) => {
      return this.group({ as: name }, routerPath);
    }
    return { group, load };
  }
  
  controller(ControllerClass: Controller) {
    const group = (cb: () => void) => {
      return this.group({ controller: ControllerClass }, cb);
    }
    
    const load = (routerPath: string) => {
      return this.group({ controller: ControllerClass }, routerPath);
    }
    return { group, load };
  }
  
  middleware(aliases: MiddlewareAliaseWithOrWithoutOptions | MiddlewareAliaseWithOrWithoutOptions[]) {
    if(typeof aliases === "string") {
      aliases = [aliases];
    }
    
    const group = (cb: () => void) => {
      return this.group({ middlewares: aliases as MiddlewareAliaseWithOrWithoutOptions[] }, cb);
    }
    
    const load = (routerPath: string) => {
      return this.group({ middlewares: aliases as MiddlewareAliaseWithOrWithoutOptions[] }, routerPath);
    }
    return { group, load };
  }
  
  /**
   * Discovers routes from a base directory 
   * and prefix its paths based on filename.
  */
  async discover(base: string) {
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
          const routerPath = "~/" + itemPath.split(".")[0];
          await this.prefix(itemPathEndpoint).load(routerPath);
        }
        else if (status.isDirectory()) {
          stack.push(itemPath);
        }
      }
    }
    this.reset();
  }
  
  async build(http: Express) {
    this.request.inject(http.request);
    this.response.inject(http.response);

    for(const { method, path, metadata, middlewares } of this.stack) {
      const { controller, key, name } = metadata;
      const controllerInstance = resolve<any>(controller);
      const requestHandler = controllerInstance[key]?.bind(controllerInstance);
      if(typeof requestHandler !== "function")
        throw new Error(`${key} handler doesn't exist on ${controller.name}`);

      http[method](path, await this.resolveMiddleware(...middlewares), requestHandler);
    }
    
    http.all("*", this.fallbackHandler);
    
    return http;
  }
}

export default new Router;