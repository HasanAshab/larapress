import { NextFunction, RequestHandler, Request, Response } from "express";
import { MiddlewareKeyWithOptions } from "types"; 
import { Model } from "mongoose";
import config from "config";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { middlewareAliases } from "~/app/http/kernel";


/**
 * Generates middlewares stack based on keys. Options are injected to the middleware class.
 * You can pass only keys or strings that are devided by ':' first part is the 
 * key and second is options separated by ','
 *
 * Examples:
 * 
 * middleware("foo")
 * middleware("foo", "bar")
 * middleware("foo:opt1", "bar:opt1,opt2")
*/
export function middleware(...keysWithOptions: MiddlewareKeyWithOptions[]): RequestHandler[] {
  const handlers = [];
  keysWithOptions.forEach(keyWithOptions => {
    const [key, optionString] = keyWithOptions.split(":");
    const options = optionString ? optionString.split(",") : [];
    const MiddlewareClass = require(middlewareAliases[key]).default;
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

/**
 * Generates endpoints of a directory.
 * Used for a simple File Based Routing.
*/
export function generateEndpoints(rootPath: string): Record < string, string > {
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