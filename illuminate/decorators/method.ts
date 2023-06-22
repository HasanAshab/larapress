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

/*
export function passErrorsToHandler() {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const value = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      try {
        return await value.apply(this, args);
      }
      catch (err: any) {
        for (const arg of args) {
          if (typeof arg === "function") {
            arg(err);
            break;
          }
        }
      }
    }
  }
}

*/