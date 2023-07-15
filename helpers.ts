import {
  NextFunction,
  RequestHandler,
  Request,
  Response
} from "express";
import {
  Model
} from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import middlewarePairs from "register/middlewares";
import customErrors from "register/errors";


export function base(basePath = ""): string {
  return path.join(__dirname, basePath);
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function storage(storage_path = "") {
  return path.resolve(path.join("storage", storage_path));
}

export function middleware(
  ...keysWithConfig: (keyof typeof middlewarePairs | [keyof typeof middlewarePairs, Record < string, unknown >])[]
): RequestHandler[] {
  function wrapMiddleware(context: object, handler: Function) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        return await handler.apply(context, [req, res, next]);
      }
      catch (err: any) {
        next(err);
      }
    }
  }
  function getMiddleware(middlewareKey: string, config?: Record < string, unknown >): RequestHandler[] {
    const middlewarePaths = middlewarePairs[middlewareKey as keyof typeof middlewarePairs];
    const handlers: RequestHandler[] = [];
    if (typeof middlewarePaths === "string") {
      const fullPath = middlewarePaths.startsWith("<global>")
      ?middlewarePaths.replace("<global>", "illuminate/middlewares/global"): `app/http/${config?.version ?? getVersion()}/middlewares/${middlewarePaths}`;
      const MiddlewareClass = require(path.resolve(fullPath)).default;
      const middlewareInstance = new MiddlewareClass(config);
      const handler = middlewareInstance.handle.length === 4 ? middlewareInstance.handle.bind(middlewareInstance): wrapMiddleware(middlewareInstance, middlewareInstance.handle);
      handlers.push(handler)
    } else {
      for (const middlewarePath of middlewarePaths) {
        const fullPath = middlewarePath.startsWith("<global>")
        ?middlewarePath.replace("<global>", "illuminate/middlewares/global"): `app/http/${config?.version ?? getVersion()}/middlewares/${middlewarePath}`;
        const MiddlewareClass = require(path.resolve(fullPath)).default;
        const middlewareInstance = new MiddlewareClass(config);
        const handler = middlewareInstance.handle.length === 4 ? middlewareInstance.handle.bind(middlewareInstance): wrapMiddleware(middlewareInstance, middlewareInstance.handle);
        handlers.push(handler)
      }
    }
    return handlers
  }
  let middlewares: RequestHandler[] = [];
  for (const keyWithConfig of keysWithConfig) {
    if (typeof keyWithConfig === "string") {
      middlewares = [...middlewares,
        ...getMiddleware(keyWithConfig)];
    } else {
      const [key,
        config] = keyWithConfig;
      const middleware = getMiddleware(key, config);
      middlewares = [...middlewares,
        ...middleware];
    }
  }
  return middlewares;
}


export function controller(name: string, version?: string): Record < string, RequestHandler[] > {
  version = version ?? getVersion();
  const controllerPath = path.resolve(path.join(`app/http/${version}/controllers`, name));
  const controllerClass = require(controllerPath).default;
  const controllerInstance = new controllerClass;
  const controllerPrefix = controllerClass.name.replace("Controller", "");
  const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(controllerInstance)).filter(name => name !== "constructor" && typeof controllerInstance[name] === 'function');
  const handlerAndValidatorStack: Record < string,
  RequestHandler[] > = {};
  for (const methodName of methodNames) {
    const requestHandler = async function(req: Request, res: Response, next: NextFunction) {
      try {
        const handler = controllerInstance[methodName];
        if (handler.length === 2) await handler(req, res);
        else if (handler.length === 1 || handler.length === 0) {
          const response = await handler(req);
          res.api(response);
        } else throw new Error(`Unknown param on ${controllerClass.name}:${methodName}`);
      }
      catch(err: any) {
        next(err)
      }
    }
    const validationSubPath = `${controllerPrefix}/${capitalizeFirstLetter(methodName)}`;
    handlerAndValidatorStack[methodName] = [
      ...middleware(["validate", {
        version, validationSubPath
      }]),
      requestHandler
    ];
  }
  return handlerAndValidatorStack;
}

export function setEnv(envValues: object) {
  const envConfig = dotenv.parse(fs.readFileSync(".env"));
  for (const key in envValues) {
    envConfig[key] = envValues[key];
  }
  try {
    fs.writeFileSync(".env", Object.entries(envConfig).map(([k, v]) => `${k}=${v}`).join("\n"));
  }
  catch(err: any) {
    throw err;
  }
}

export function log(data: any): void {
  const path = "./storage/error.log";
  if(data instanceof Error){
    data = data.stack
  }
  fs.appendFile(path, `${new Date()}:\n${data.toString()}\n\n\n`, (err: any) => {
    if (err) {
      throw err;
    }
  });
}


export function getVersion(path?: string): string {
  let target: string;
  if (typeof path === "undefined") {
    const error = new Error();
    const stackTrace = error.stack;
    if (!stackTrace) throw new Error("Failed to auto infer version. try to pass target path!");
    target = stackTrace
  } else target = path;
  const regex = /\/(v\d+)\//;
  const match = target.match(regex);
  if (!match) throw new Error('This path is not a nested versional path!');
  return match[1];
}


export function checkProperties(obj: any, properties: Record < string, string >): boolean {
  for (const [name, type] of Object.entries(properties)) {
    if (!(name in obj && typeof obj[name] === type)) {
      return false;
    }
  }
  return true;
}

export function customError(type: keyof typeof customErrors, data?: object): Error {
  const errorData = customErrors[type];
  const error: any = new Error();
  //error.name = this.name;
  error.type = type;
  error.status = errorData.status;
  error.message = errorData.message;
  
  if (typeof data !== "undefined") {
    error.message = error.message.replace(/:(\w+)/g, (match: string, key: string) => {
      if(typeof data[key as keyof typeof data] === "undefined") throw new Error(`The "${key}" key is required in "data" argument.`);
      return data[key as keyof typeof data];
    });
  }
  return error;
}

export async function getModels(): Promise < Model < any > [] > {
  const models: Model < any > [] = []
  const modelNames = await fs.promises.readdir(base("app/models"));
  for (const modelName of modelNames) {
    const Model = require(base(`app/models/${modelName}`)).default;
    models.push(Model);
  }
  return models;
}