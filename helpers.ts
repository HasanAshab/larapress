import { NextFunction, RequestHandler, Request, Response } from "express";
import { Model } from "mongoose";
import config from "config";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import middlewarePairs from "register/middlewares";
import customErrors from "register/errors";
import mongoose from "mongoose";

export function base(basePath = "") {
  return path.join(__dirname, basePath);
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toCamelCase(str: string) {
  return str.replace(/_./g, (match) => match.charAt(1).toUpperCase());
}

export function toSnakeCase(str: string) {
  return str.replace(/([A-Z])/g, '_$1');
}

export function storage(storage_path = "") {
  return path.join(__dirname, "storage", storage_path);
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
  function getMiddleware(middlewareKey: string, config?: Record < string, unknown >): RequestHandler {
    const middlewarePath = middlewarePairs[middlewareKey as keyof typeof middlewarePairs];
      const fullPath = middlewarePath.startsWith("<global>")
        ? middlewarePath.replace("<global>", "illuminate/middlewares/global")
        : `app/http/${config?.version ?? "v1"}/middlewares/${middlewarePath}`;
      const MiddlewareClass = require(path.resolve(fullPath)).default;
      const middlewareInstance = new MiddlewareClass(config);
      const handler = middlewareInstance.handle.length === 4 ? middlewareInstance.handle.bind(middlewareInstance): wrapMiddleware(middlewareInstance, middlewareInstance.handle);
      return handler;
  }
  let middlewares: RequestHandler[] = [];
  for (const keyWithConfig of keysWithConfig) {
    if (typeof keyWithConfig === "string") {
      middlewares.push(getMiddleware(keyWithConfig));
    } else {
      middlewares.push(getMiddleware(keyWithConfig[0], keyWithConfig[1]));
    }
  }
  return middlewares;
}

export function controller(name: string, version = getVersion()): Record < string, RequestHandler[] > {
  const controllerPath = path.resolve(path.join(`app/http/${version}/controllers`, name));
  const controllerClass = require(controllerPath).default;
  const controllerInstance = new controllerClass;
  const controllerPrefix = controllerClass.name.replace("Controller", "");
  const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(controllerInstance)).filter(name => name !== "constructor" && typeof controllerInstance[name] === 'function');
  const handlerAndValidatorStack: Record <string, RequestHandler[]> = {};
  for (const methodName of methodNames) {
    const requestHandler = async function(req: Request, res: Response, next: NextFunction) {
      try {
        const handler = controllerInstance[methodName];
        if (handler.length === 2) await handler(req, res);
        else if (handler.length === 1 || handler.length === 0) {
          const response = await handler(req);
          const { status = 200 } = response;
          delete response.status;
          res.status(status).api(response);
        } else throw new Error(`Unknown param on ${name}:${methodName}`);
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



export function env(envValues?: Record<string, string>) {
  const envConfig = dotenv.parse(fs.readFileSync(".env"));
  if(!envValues) return envConfig;
  for (const key in envValues) {
    process.env[key] = envValues[key];
    envConfig[key] = envValues[key];
  }
  try {
    fs.writeFileSync(".env", Object.entries(envConfig).map(([k, v]) => `${k}=${v}`).join("\n"));
  }
  catch(err: any) {
    throw err;
  }
  return envConfig;
}

export async function log(data: any) {
  const logChannel = config.get("log");
  if(logChannel === "file"){
    const path = "./storage/logs/error.log";
    if(data instanceof Error){
      data = data.stack
    }
    fs.appendFile(path, `${new Date()}:\n${data.toString()}\n\n\n`, (err: any) => {
      if (err)
        throw err;
    });
  }
  else if(logChannel === "console"){
    console.log(data)
  }
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
  error.type = type;
  error.status = errorData.status;
  error.message = errorData.message;
  if (data) {
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

export function generateEndpointsFromDirTree(rootPath: string): Record < string, string > {
  const endpointPathPair: Record < string,
  string > = {}
  const stack = [rootPath];
  while (stack.length > 0) {
    const currentPath = stack.pop();
    if (!currentPath) {
      break;
    }
    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      const status = fs.statSync(itemPath);

      if (status.isFile()) {
        const itemPathEndpoint = itemPath
        .replace(rootPath, "")
        .split(".")[0]
        .toLowerCase()
        .replace(/index$/, "");
        
        endpointPathPair[itemPathEndpoint] = itemPath;
      } else if (status.isDirectory()) {
        stack.push(itemPath);
      }
    }
  }
  return endpointPathPair;
}