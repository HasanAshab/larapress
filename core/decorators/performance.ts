import { Request, Response, NextFunction } from "express";

export function Performance(constructor: Function) {
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

export function performance() {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const value = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      console.time(propertyKey)
      const result = await value.apply(this, args);
      console.timeEnd(propertyKey)
      return result;
    }
  }
}
