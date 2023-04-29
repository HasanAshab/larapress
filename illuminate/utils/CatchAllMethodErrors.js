class CatchAllMethodErrors {
  wrapMethods(cls){
    const methods = Object.getOwnPropertyNames(cls);
    for (const method of methods) {
      if(!['length', 'name', 'prototype'].includes(method)){
        cls[method] = this.withTryCatch(cls[method]);
      }
    }
  }
  
  withTryCatch(fn){
    return async function(...args) {
      try {
        return await fn(...args);
      }
      catch (err) {
        args[2](err)
      }
    }
  }
}


module.exports = CatchAllMethodErrors;