export function inject(target: any, propertyKey: string, parameterIndex: number) {
  const injectableParamsIndex = Reflect.getMetadata('injectParam', target, propertyKey) ?? [];
  injectableParamsIndex.push(parameterIndex);
  Reflect.defineMetadata('injectParam', injectableParamsIndex, target, propertyKey);
}
