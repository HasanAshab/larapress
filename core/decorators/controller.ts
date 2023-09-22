import { container } from 'tsyringe';

export default function Controller(constructor: Function) {
  const methodNames = Object.getOwnPropertyNames(constructor.prototype);
  for (const methodName of methodNames) {
    const method = constructor.prototype[methodName];
    if (methodName === "constructor" || typeof method !== "function") continue;
    const paramTypes = Reflect.getMetadata('design:paramtypes', constructor.prototype, methodName);
    const injectableIndexes = Reflect.getMetadata('injectParam', constructor.prototype, methodName) ?? [];
    const resolvedDependencies = injectableIndexes.map((index) => container.resolve(paramTypes[index]));
    constructor.prototype[methodName] = async function (req, res, next) {
      const args = [req, res];
      for (let i = 0; i < injectableIndexes.length; i++) {
        args[injectableIndexes[i]] = resolvedDependencies[i];
      }
      try {
        await method.apply(this, args);
      }
      catch (err) {
        next(err);
      }
    }
  }
}
