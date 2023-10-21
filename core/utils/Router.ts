import _ from "lodash";
import { join } from "path";
import { Router as ExpressRouter } from "express";
import { middlewareAliases } from "~/app/http/kernel";

export default class Router {
  static $config = {
    version: null,
    prefix: "/",
    as: "",
    controller: null,
    middlewares: []
  }
  static $stack = [];
  static $namedUrls = {};
  
  static $add(method: string, endpoint: string, metadata) {
    const path = join(Router.$config.prefix, endpoint);
    if(typeof metadata === "string") {
      if(!Router.$config.controller)
        throw new Error(`Must pass a controller in "${endpoint}" route as no global controller exist`);
      metadata = [Router.$config.controller, metadata];
    }
    const stackIndex = Router.$stack.length;
    Router.$stack.push({ 
      method,
      path,
      metadata,
      middlewares: [...Router.$config.middlewares]
    });
    
    const middleware = (...aliases: string[]) => {
      Router.$stack[stackIndex].middlewares.push(...aliases);
      return this;
    }
    const name = (routeName: string) => {
      Router.$namedUrls[Router.$config.as + routeName] = Router.$stack[stackIndex].path;
      return this;
    }

    return { name, middleware };
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
  
  static setup(version: string, prefix: string) {
    Router.$config = {
      prefix,
      as: "",
      version,
      controller: null,
      middlewares: []
    };
  }
  static getMiddleware(...args) {
    const parseArgs = () => {
      return Array.isArray(args[1])
        ? [args[0], args[1]]
        : [Router.$config.version, args];
    }
    const [version, keysWithOptions] = parseArgs();
    const handlers = [];
    keysWithOptions.forEach(keyWithOptions => {
      const [key, optionString] = keyWithOptions.split(":");
      const options = optionString ? optionString.split(",") : [];
      const middlewarePath = middlewareAliases[key].replace("<version>", version);
      const MiddlewareClass = require(middlewarePath).default;
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
  
  static build() {
    const router = ExpressRouter();
    console.log(Router.$stack)

    for(const { method, path, metadata, middlewares } of Router.$stack) {
      const [Controller, handlerName] = metadata;
      const controller = new Controller();
      const handler = controller[handlerName].bind(controller);
      router[method](path, this.getMiddleware(...middlewares), handler);
    }
    return router;
  }
}
