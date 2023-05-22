import path from "path";
import fs from "fs";
import {
  EndpointCallback
} from "types";

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

export function generateEndpointsFromDirTree(rootPath: string, cb: EndpointCallback) {
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
        .toLowerCase();
        cb(itemPathEndpoint, itemPath);
      } else if (status.isDirectory()) {
        stack.push(itemPath);
      }
    }
  }
}

export function matchWildcard(str: string, query: string): boolean {
  const withoutWildcard = query.split('*');
  const startIndex = str.indexOf(withoutWildcard[0]);
  
  const endIndex = withoutWildcard[1] === ""
    ? str.length
    : str.indexOf(withoutWildcard[1], startIndex + withoutWildcard.length);
  return startIndex !== -1 && endIndex !== -1;
}

export function replaceWildcard(str: string, query: string, replacement: string, replacedStr = str): string {
  if (query.split("*").length - 1 !== 1) return null;
  const withoutWildcard = query.split("*");
  const startIndex = str.indexOf(withoutWildcard[0]) + withoutWildcard[0].length;
  if (withoutWildcard[1] === "") {
    const wildcard = str.substring(startIndex);
    return replacedStr.replace(query.replace("*", wildcard), replacement.replace("*", wildcard))
  }
  const endIndex = str.indexOf(withoutWildcard[1], startIndex);
  if (startIndex === -1 || endIndex === -1) return replacedStr;
  const wildcard = str.substring(startIndex, endIndex);
  replacedStr = replacedStr.replace(query.replace("*", wildcard), replacement.replace("*", wildcard));
  return replaceWildcard(str.substring(endIndex), query, replacement, replacedStr);
}