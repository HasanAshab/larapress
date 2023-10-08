export default class Controller {
  static handlers(...args: any[]) {
    const reqHandlers = {};
    const controller = new this(...args);
    const handlersName = Reflect.getMetadata("handlersName", controller) ?? [];
    for(const name of handlersName) {
      if(name !== "constructor" && name !== "handlers")
        reqHandlers[name] = controller[name].bind(controller);
    }
    return reqHandlers;
  }
}