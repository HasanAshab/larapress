export default class MethodInjector<Target extends object> {
  private data: Record<string, any> = {};
  
  inject(target: Target) {
    for(const key in this.data) {
      const prop = this.data[key];
      if(typeof prop === "object")
        Object.defineProperty(target, key, prop);
      else target[key] = prop;
    }
  }
  
  add(key: string, value: unknown & ((this: Target) => any)) {
    this.data[key] = value;
  }
  
  accessor(method: "get" | "set", key: string, fn: ((this: Target) => any)) {
    if(this.data[key])
      this.data[key][method] = fn;
    else this.data[key] = { [method]: fn };
  }
    
  getter(key: string, fn: ((this: Target) => any)) {
    this.accessor("get", key, fn);
  }
  
  setter(key: string, fn: ((this: Target) => any)) {
    this.accessor("set", key, fn);
  }
}