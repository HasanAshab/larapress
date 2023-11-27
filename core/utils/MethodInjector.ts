export default class MethodInjector<Target extends object> {
  private data: Record<string, any> = {};
  
  inject(target: Target) {
    Object.assign(target, this.data);
  }
  
  add(key: string, value: unknown & ((this: Target) => any)) {
    this.data[key] = value;
  }
    
  getter(key: string, method: ((this: Target) => any)) {
    Object.defineProperty(this.data, key, { 
      get: method,
      configurable: true
    });
  }
  
  setter(key: string, method: ((this: Target) => any)) {
    Object.defineProperty(this.data, key, { 
      set: method,
      configurable: true
    });
  }
}
