import { Request, Response, NextFunction } from "express";

export function performance(constructor: Function) {
  const methodNames = Object.getOwnPropertyNames(constructor.prototype);
  for (const methodName of methodNames) {
    const method = constructor.prototype[methodName];
    if (methodName === "constructor" || typeof method !== "function") {
      continue;
    }
    constructor.prototype[methodName] = async function (...args: any[]): Promise < void > {
      console.time(`${constructor.name}.${methodName}`)
      const result = await method.apply(constructor, args);
      console.timeEnd(`${constructor.name}.${methodName}`)
      return result;
    }
  }
}