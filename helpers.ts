import { UrlData } from "types";
import { RequestHandler } from "express"
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import urls from "register/urls";
import middlewarePairs from "register/middlewares";

export function base(basePath = ""): string {
  return path.join(__dirname, basePath);
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function url(url_path: string = ""): string {
  const domain = process.env.APP_DOMAIN;
  const port = process.env.APP_PORT;
  const protocol = "http";
  //const protocol = port === "443"? "https" : "http";
  return `${protocol}://${path.join(`${domain}:${port}`, url_path)}`;
}

export function clientUrl(url_path: string = ""): string {
  const domain = process.env.CLIENT_DOMAIN;
  const port = process.env.CLIENT_PORT;
  const protocol = "http";
  //const protocol = port === "443"? "https" : "http";
  return `${protocol}://${path.join(`${domain}:${port}`, url_path)}`;
}

export function route(name: string, data?: UrlData): string {
  let endpoint = urls[name];
  if (!endpoint) {
    throw new Error("Endpoint not found!")
  }
  if (data) {
    const regex = /:(\w+)/g;
    const params = endpoint.match(regex);
    if (params) {
      for (const param of params) {
        endpoint = endpoint.replace(param, data[param.slice(1)]?.toString())
      }
    }
  }
  return `${process.env.APP_URL}${endpoint}`;
}

export function storage(storage_path: string = ""): string {
  return path.resolve(path.join("storage", storage_path));
}

export function middleware(keys: string | string[], version?: string): RequestHandler[] | RequestHandler {
  function getMiddleware(middlewarePath: string, options: string[] = []) {
    const fullPath = middlewarePath.startsWith("<global>")
      ?middlewarePath.replace("<global>", "illuminate/middlewares/global")
      :`app/http/${version ?? getVersion()}/middlewares/${middlewarePath}`;
    const MiddlewareClass = require(path.resolve(fullPath)).default;
    const middlewareInstance = new MiddlewareClass(options);
    const handler = middlewareInstance.handle.bind(middlewareInstance);
    return handler;
  }
  if (Array.isArray(keys)) {
    const middlewares = [];
    for (const key of keys) {
      const [name,
        params] = key.split(":");
      const middlewarePaths = middlewarePairs[name];
      if (Array.isArray(middlewarePaths)) {
        const funcBasedParams = params?.split("|")
        for (let i = 0; i < middlewarePaths.length; i++) {
          const middleware = getMiddleware(middlewarePaths[i], funcBasedParams?.[i]?.split(","));
          middlewares.push(middleware);
        }
      } else {
        const middleware = getMiddleware(middlewarePaths, params?.split(","));
        middlewares.push(middleware);
      }
    }
    return middlewares;
  }

  const [name,
    params] = keys.split(":");
  const middlewarePaths = middlewarePairs[name];
  if (middlewarePaths instanceof Array) {
    const middlewares = [];
    const funcBasedParams = typeof params !== "undefined"
    ? params.split("|"): undefined;
    for (let i = 0; i < middlewarePaths.length; i++) {
      const middleware = getMiddleware(middlewarePaths[i], funcBasedParams?.[i]?.split(","));
      middlewares.push(middleware);
    }
    return middlewares;
  }
  return getMiddleware(middlewarePaths, params?.split(","));
}


export function controller(name: string, version?: string): Record<string, RequestHandler | RequestHandler[]> {
  version = version ?? getVersion();
  const controllerPath = path.resolve(path.join(`app/http/${version}/controllers`, name));
  const controllerClass = require(controllerPath).default;
  const controllerInstance = new controllerClass;
  const controllerPrefix = controllerClass.name.replace("Controller", "");
  const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(controllerInstance)).filter(name => name !== "constructor" && typeof controllerInstance[name] === 'function');
  const handlerAndValidatorStack: Record<string, RequestHandler | RequestHandler[]> = {};
  for (const methodName of methodNames){
    const validationSubPath = `${controllerPrefix}/${capitalizeFirstLetter(methodName)}`;
    handlerAndValidatorStack[methodName] = [
      middleware(`validate:${version},${validationSubPath}`),
      controllerInstance[methodName]
    ];
  }
  return handlerAndValidatorStack;
}

export function setEnv(envValues: object): boolean {
  const envConfig = dotenv.parse(fs.readFileSync(".env"));
  for (const [key, value] of Object.entries(envValues)) {
    envConfig[key] = value;
  }
  try {
    fs.writeFileSync(".env", Object.entries(envConfig).map(([k, v]) => `${k}=${v}`).join("\n"));
    return true;
  }
  catch(err: any) {
    throw err;
  }
}

export function log(data: any): void {
  const path = "./storage/error.log";
  if (typeof data === "object") {
    data = JSON.stringify(data);
  }
  fs.appendFile(path, `${data}\n\n\n`, (err: any) => {
    if (err) {
      throw err;
    }
  });
}


export function getVersion(path?: string): string {
  let target: string;
  if(typeof path === "undefined"){
    const error = new Error();
    const stackTrace = error.stack;
    if(!stackTrace) throw new Error("Failed to auto infer version. try to pass target path!");
    target = stackTrace
  }
  else target = path;
  const regex = /\/(v\d+)\//;
  const match = target.match(regex);
  if(!match) throw new Error('This path is not a nested versional path!');
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

export async function getModels(): Promise<object[]> {
  const models: object[] = []
  const modelNames = await fs.promises.readdir(base("app/models"));
  for(const modelName of modelNames){
    const Model = require(base(`app/models/${modelName}`)).default;
    models.push(Model);
  }
  return models;
}

export function getParams(func: Function): string[] {
  let str = func.toString();
  str = str.replace(/\/\*[\s\S]*?\*\//g,
    "")
  .replace(/\/\/(.)*/g,
    "")
  .replace(/{[\s\S]*}/,
    "")
  .replace(/=>/g, "")
    .trim();
    const start = str.indexOf("(") + 1;
    const end = str.length - 1;
    const result = str.substring(start, end).split(", ");
    const params: string[] = [];
    result.forEach(element => {
      element = element.replace(/=[\s\S]*/g, "").trim();
      if (element.length > 0)
        params.push(element);
    });

    return params;
  }