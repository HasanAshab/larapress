export default class MethodInjector<
  Target extends object,
  Method = (this: Target, ...args: any[]) => any
> {
  
  private data: Record<string, any> = {};
  
  inject(target: Target) {
    for(const key in this.data) {
      const prop = this.data[key];
      if(typeof prop === "object")
        Object.defineProperty(target, key, prop);
      else (target as any)[key] = prop;
    }
  }
  
  set(key: string, value: unknown) {
    this.data[key] = value;
  }
  
  method(key: string, fn: Method) {
    this.data[key] = fn;
  }
  
  accessor(method: "get" | "set", key: string, fn: Method) {
    if(this.data[key])
      this.data[key][method] = fn;
    else this.data[key] = { [method]: fn };
  }
    
  getter(key: string, fn: Method) {
    this.accessor("get", key, fn);
  }
  
  setter(key: string, fn: Method) {
    this.accessor("set", key, fn);
  }
}