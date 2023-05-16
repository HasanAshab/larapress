import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { EndpointCallback } from "types";

export function generateEndpointsFromDirTree(rootPath: string, cb: EndpointCallback): void {
  const stack = [rootPath];
  while (stack.length > 0) {
    const currentPath = stack.pop();
    if(!currentPath){
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
          .toLowerCase();
        cb(itemPathEndpoint, itemPath);
      } else if (status.isDirectory()) {
        stack.push(itemPath);
      }
    }
  }
}