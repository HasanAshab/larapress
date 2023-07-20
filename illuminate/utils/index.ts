import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { base } from "helpers";

export function loadDir(dirPath: string) {
  const normalizedPath = path.normalize(dirPath);
  if (fs.existsSync(normalizedPath)) return;
  const {
    dir,
    base
  } = path.parse(normalizedPath);
  if (!fs.existsSync(dir)) {
    loadDir(dir);
  }
  fs.mkdirSync(normalizedPath);
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