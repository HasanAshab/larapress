import { NextFunction, RequestHandler, Request, Response } from "express";
import { Model } from "mongoose";
import config from "config";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import middlewarePairs from "~/register/middlewares";
import mongoose from "mongoose";


export function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

export function deepMerge(target: any, source: any): any {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        if (!target[key]) {
          target[key] = {};
        }
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

export function storage(storage_path = "") {
  return path.join(__dirname, "storage", storage_path);
}


export function middleware(
  ...keysWithOptions:  (keyof typeof middlewarePairs | `${keyof typeof middlewarePairs}:${string}` | [keyof typeof middlewarePairs, object])[]
): RequestHandler[] {
  function wrapMiddleware(context: object, handler: Function, options = []) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        return await handler.apply(context, [req, res, next, ...options]);
      }
      catch (err: any) {
        next(err);
      }
    }
  }
  function getMiddleware(middlewareKey: string, options: string[] = [], config = {}): RequestHandler {
    const middlewarePath = middlewarePairs[middlewareKey as keyof typeof middlewarePairs];
      const fullPath = middlewarePath.startsWith("<global>")
        ? middlewarePath.replace("<global>", "~/core/global/middlewares")
        : `~/app/http/${config?.version ?? "v1"}/middlewares/${middlewarePath}`;
      const MiddlewareClass = require(fullPath).default;
      const middlewareInstance = new MiddlewareClass(config);
      const handler = middlewareInstance.handle.length === 4 
        ? middlewareInstance.handle.bind(middlewareInstance)
        : wrapMiddleware(middlewareInstance, middlewareInstance.handle, options);
      return handler;
  }
  let middlewares: RequestHandler[] = [];
  for (const keysWithOption of keysWithOptions) {
    if(typeof keysWithOption === "string") {
      const [key, options] = keysWithOption.split(":");
      middlewares.push(getMiddleware(key, options?.split(",")));
    }
    else {
      middlewares.push(getMiddleware(keysWithOption[0], undefined, keysWithOption[1]));
    }
  }
  return middlewares;
}


export function controller(name: string, version = getVersion()): Record < string, RequestHandler[] > {
  const controllerPath = path.join(`~/app/http/${version}/controllers`, name);
  const controllerClass = require(controllerPath).default;
  const controllerInstance = new controllerClass;
  const controllerPrefix = controllerClass.name.replace("Controller", "");
  const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(controllerInstance)).filter(name => name !== "constructor" && typeof controllerInstance[name] === 'function');
  const handlerAndValidatorStack: Record <string, RequestHandler[]> = {};
  for (const methodName of methodNames) {
    const requestHandler = controllerInstance[methodName].bind(controllerInstance);
    handlerAndValidatorStack[methodName] = [requestHandler];
    try {
      const validationSubPath = `${controllerPrefix}/${capitalizeFirstLetter(methodName)}`;
      const validationSchema = require(`~/app/http/${version}/validations/${validationSubPath}`).default;
      const validator = middleware(["validate", { validationSchema }])[0];
      handlerAndValidatorStack[methodName].unshift(validator);
    } catch {}
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
  const logChannel = config.get<string>("log");
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
    if (!stackTrace) throw new Error("Failed to auto infer version. try to pass path manually!");
    target = stackTrace
  } else target = path;
  const regex = /\/(v\d+)\//;
  const match = target.match(regex);
  if (!match) throw new Error('Not a nested versional path!\n Call Stack or Path:\n' + target);
  return match[1];
}

export async function getModels(): Promise < Model < any > [] > {
  const models: Model < any > [] = []
  const modelNames = await fs.promises.readdir("app/models");
  for (const modelName of modelNames) {
    const { default: Model } = await import(`~/app/models/${modelName}`);
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
        
        endpointPathPair[itemPathEndpoint] = "~/" + itemPath.split(".")[0];
      } else if (status.isDirectory()) {
        stack.push(itemPath);
      }
    }
  }
  return endpointPathPair;
}