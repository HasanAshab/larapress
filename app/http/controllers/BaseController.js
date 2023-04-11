class BaseController {
  static wrapMethods = (cls) => {
    const methods = Object.getOwnPropertyNames(cls);
    for (const method of methods) {
      if(typeof cls[method].method !== 'undefined'){
        cls[method].method = this.withTryCatch(cls[method].method);
      }
    }
  }
  
  static withTryCatch = (fn) => {
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


module.exports = BaseController;