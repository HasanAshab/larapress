export function performance(constructor: Function) {
  const methodNames = Object.getOwnPropertyNames(constructor.prototype);
  for (const methodName of methodNames) {
    const method = constructor.prototype[methodName];
    if (methodName === "constructor" || typeof method !== 'function') {
      continue;
    }
    constructor.prototype[methodName] = async function (...args: any[]): Promise < void > {
      console.time(`${constructor.name}.${methodName}`)
      const result = await method(...args);
      console.timeEnd(`${constructor.name}.${methodName}`)
      return result;
    }
  }
}

export function passErrorsToHandler(constructor: Function) {
  const methodNames = Object.getOwnPropertyNames(constructor.prototype);
  for (const methodName of methodNames) {
    const method = constructor.prototype[methodName];
    if (methodName === "constructor" || typeof method !== 'function') {
      continue;
    }
    constructor.prototype[methodName] = async function (...args: any[]) {
      try {
        return await method(...args);
      }
      catch (err: any) {
        for (const arg of args) {
          if (typeof arg === 'function') {
            arg(err);
            break;
          }
        }
      }
    }
  }
}