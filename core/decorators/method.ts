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