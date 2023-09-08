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

export function controller(constructor: Function) {
  const methodNames = Object.getOwnPropertyNames(constructor.prototype);
  for (const methodName of methodNames) {
    const handler = constructor.prototype[methodName];
    if (methodName === "constructor" || typeof handler !== "function") {
      continue;
    }
    constructor.prototype[methodName] = async function (req: Request, res: Response, next: NextFunction) {
      try {
        return await handler.call(constructor, req, res);
      }
      catch (err) {
        next(err)
      }
    }
  }
}


export function util(mockClass: any) {
  return function(targetClass: any) {
    const staticMethods = Object.getOwnPropertyNames(mockClass).filter(
      (method) =>
      method !== 'constructor' &&
      method !== 'length' &&
      method !== 'name' &&
      method !== 'prototype'
    );
    staticMethods.forEach((method) => {
      if(method.endsWith("Logger")){
        const targetMethodName = method.replace("Logger", "");
        const targetMethod = targetClass[targetMethodName];
        targetClass[targetMethodName] = function (...args: any[]) {
          this.isMocked && mockClass[method].apply(this, args);
          return targetMethod.apply(this, args);
        }
      }
      else if (targetClass[method]) {
        const realMethod = targetClass[method];
        targetClass[method] = function (...args: any[]) {
          return this.isMocked ? mockClass[method].apply(this, args) : realMethod.apply(this, args);
        };
      } else {
        targetClass[method] = mockClass[method];
      }
    });
  };
}
