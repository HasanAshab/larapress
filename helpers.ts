import {
  RequestHandler
} from "express";
import {
  MiddlewareKey
} from "types";
import {
  Model
} from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import middlewarePairs from "register/middlewares";

export function base(basePath = ""): string {
  return path.join(__dirname, basePath);
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function storage(storage_path = ""): string {
  return path.resolve(path.join("storage", storage_path));
}

type OneKey < T extends object, V = any > = {
  [P in keyof T]: (Record < P, V > &
    Partial < Record < Exclude < keyof T, P >, never>>) extends infer O
  ? {
    [Q in keyof O]: O[Q]
  }: never
}[keyof T];

// middleware(["foo", {bar: {}}])
export function middleware(
  ...keysWithConfig: (keyof typeof middlewarePairs | OneKey < typeof middlewarePairs, Record < string, unknown>>)[]
): RequestHandler[] {
  function getMiddleware(middlewareKey: string, config?: Record < string, unknown >) {
    const middlewarePaths = middlewarePairs[middlewareKey as keyof typeof middlewarePairs];
    if (typeof middlewarePaths === "string") {
      const fullPath = middlewarePaths.startsWith("<global>")
      ?middlewarePaths.replace("<global>", "illuminate/middlewares/global"): `app/http/${config?.version ?? getVersion()}/middlewares/${middlewarePaths}`;
      const MiddlewareClass = require(path.resolve(fullPath)).default;
      const middlewareInstance = new MiddlewareClass(config);
      const handler = middlewareInstance.handle.bind(middlewareInstance);
      return handler;
    } else {
      const handlers: RequestHandler[] = [];
      for (const middlewarePath of middlewarePaths) {
        const fullPath = middlewarePath.startsWith("<global>")
        ?middlewarePath.replace("<global>", "illuminate/middlewares/global"): `app/http/${config?.version ?? getVersion()}/middlewares/${middlewarePath}`;
        const MiddlewareClass = require(path.resolve(fullPath)).default;
        const middlewareInstance = new MiddlewareClass(config);
        const handler = middlewareInstance.handle.bind(middlewareInstance);
        handlers.push(handler)
      }
      return handlers;
    }
  }
  const middlewares: RequestHandler[] = []
  for (const keyWithConfig of keysWithConfig) {
    if (typeof keyWithConfig === "string") {
      middlewares.push(getMiddleware(keyWithConfig));
    } else {
      for (const [key, config] of Object.entries(keyWithConfig)) {
        const middleware = getMiddleware(key, config as Record < string, unknown >)
        middlewares.push(middleware);
      }
    }
  }
  return middlewares;
}


export function middlewareOld(keys: MiddlewareKey | MiddlewareKey[], version?: string): RequestHandler[] | RequestHandler {
function getMiddleware(middlewarePath: string, options: string[] = []) {
const fullPath = middlewarePath.startsWith("<global>")
?middlewarePath.replace("<global>", "illuminate/middlewares/global"): `app/http/${version ?? getVersion()}/middlewares/${middlewarePath}`;
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
const middlewarePaths = middlewarePairs[name as keyof typeof middlewarePairs];
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
const middlewarePaths = middlewarePairs[name as keyof typeof middlewarePairs];
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


export function controller(name: string, version?: string): Record < string, RequestHandler | RequestHandler[] > {
version = version ?? getVersion();
const controllerPath = path.resolve(path.join(`app/http/${version}/controllers`, name));
const controllerClass = require(controllerPath).default;
const controllerInstance = new controllerClass;
const controllerPrefix = controllerClass.name.replace("Controller", "");
const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(controllerInstance)).filter(name => name !== "constructor" && typeof controllerInstance[name] === 'function');
const handlerAndValidatorStack: Record < string,
RequestHandler | RequestHandler[] > = {};
for (const methodName of methodNames) {
const validationSubPath = `${controllerPrefix}/${capitalizeFirstLetter(methodName)}`;
handlerAndValidatorStack[methodName] = [
middleware({
validate: {
version, validationSubPath
}}),
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

export async function getModels(): Promise < Model < any > [] > {
const models: Model < any > [] = []
const modelNames = await fs.promises.readdir(base("app/models"));
for (const modelName of modelNames) {
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