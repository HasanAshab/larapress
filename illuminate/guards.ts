export function isObject(target: any): target is object {
  return target instanceof Object && !(target instanceof Array);
}