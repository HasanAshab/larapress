import { NextFunction, RequestHandler, Request, Response } from "express";
import { MiddlewareKeyWithOptions } from "types"; 
import { Model } from "mongoose";
import config from "config";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { middlewareAliases } from "~/app/http/kernel";
import { container } from "tsyringe";


/**
 * Generates middlewares stack based on keys. Options are injected to the middleware class.
 * You can pass only keys
 * or strings that are devided by ':' first part is the key and second is options separated by ','
 * or an array of first element as key and second element as config obj. This may be used when you need complex config
 *
 * Examples:
 * 
 * middleware("foo")
 * middleware("foo", "bar")
 * middleware("foo:opt1", "bar:opt1,opt2")
 * middleware(["foo", config], ["bar", config])
*/
export function middleware(...keysWithOptions: MiddlewareKeyWithOptions[]): RequestHandler[] {
  //helper function to auto pass errors of middleware to next() closure
  function wrapMiddleware(context: object, handler: Function, options: string[] = []) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        return await handler.apply(context, [req, res, next, ...options]);
      }
      catch (err: any) {
        next(err);
      }
    }
  }
  /**
   * Helper function to import middleware class by using middlewareAliases. Injects config and options to the middleware class.
   * Returns actual middleware function.
  */
  function getMiddleware(middlewareKey: string, options: string[] = [], config = {}): RequestHandler {
    const middlewarePath = middlewareAliases[middlewareKey as keyof typeof middlewareAliases];
      const fullPath = middlewarePath.startsWith("<global>")
        ? middlewarePath.replace("<global>", "~/core/global/middlewares")
        : `~/app/http/${getVersion()}/middlewares/${middlewarePath}`;
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

/**
 * Takes controller file name and version (if not provided, it uses getVersion() to auto detect version) as argument.
 * It search for Controller on app/http/{version}/controllers directory with that name. It travers to all methods of
 * the controller to make a stack of request validation middleware and the method. 
 * Returns a object with key of controller method name and value as their assosiated stack.
 * 
 * Example:
 * 
 * Assume we have AuthController with login, register and profile methods. login and register have validation files
 * and profile haven't. Calling controller("AuthController") will give an object like that:
 * { 
 *  register: [ Validator, Method ],
 *  login: [ Validator, Method ],
 *  profile: [ Method ],
 * }
*/ 
export function controller(name: string, version = getVersion()): Record<string, RequestHandler[]> {
  const controllerPath = `~/app/http/${version}/controllers/${name}`;
  const ControllerClass = require(controllerPath).default;
  const controllerInstance = container.resolve(ControllerClass);
  const controllerPrefix = name.replace("Controller", "");
  const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(controllerInstance)).filter(name => name !== "constructor" && typeof controllerInstance[name] === 'function');
  const handlerAndValidatorStack: Record <string, RequestHandler[]> = {};
  for (const methodName of methodNames) {
    handlerAndValidatorStack[methodName] = [controllerInstance[methodName]];
    try {
      const validationSubPath = `${controllerPrefix}/${capitalizeFirstLetter(methodName)}`;
      const validationSchema = require(`~/app/http/${version}/validations/${validationSubPath}`).default;
      const validator = middleware(["validate", { validationSchema }])[0];
      handlerAndValidatorStack[methodName].unshift(validator);
    } catch {}
  }
  return handlerAndValidatorStack;
}

/**
 * Returns environment variables. if envValues provided, then it updates environment
*/
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

/**
 * Logs data on different channels based on config
*/
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

/**
 * Get version from call location or provide a path to get its version
 * 
 * Examples:
 * 
*/ 
export function getVersion(path?: string): string {
  let target: string;
  if (typeof path === "undefined") {
    const error = new Error();
    const stackTrace = error.stack;
    if (!stackTrace) throw new Error("Failed to auto infer version. try to pass path explicitly!");
    target = stackTrace
  } else target = path;
  const regex = /\/(v\d+)\//;
  const match = target.match(regex);
  if (!match) throw new Error('Not a nested versional path!\n Call Stack or Path:\n' + target);
  return match[1];
}

export function generateEndpointsFromDirTree(rootPath: string): Record < string, string > {
  const endpointPathPair: Record<string, string> = {}
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


export function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

export function getParams(func: Function) {
  let str = func.toString();
  str = str.replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/(.)*/g, '')
    .replace(/{[\s\S]*}/, '')
    .replace(/=>/g, '')
    .trim();
  let start = str.indexOf("(") + 1;
  let end = str.length - 1;
  let result = str.substring(start, end).split(", ");
  let params = [];
  result.forEach(element => {
    element = element.replace(/=[\s\S]*/g, '').trim();
      if (element.length > 0)
        params.push(element);
  });
  return params;
}
