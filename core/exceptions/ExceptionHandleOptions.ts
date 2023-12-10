import type { Handlers, Reporter, Renderer } from "./Handler";

export default class ExceptionHandleOptions<T extends constructor> {
  constructor(private readonly exception: T, private handlers: Partial<Handlers<T>>, private dontReportingExceptions: constructor[]) {
    this.exception = exception;
    this.handlers = handlers;
    this.dontReportingExceptions = dontReportingExceptions;
  }
  
  dontReport() {
    this.dontReportingExceptions.push(this.exception);
    return this;
  }
    
  report(reporter: Reporter<T>) {
    this.handlers.report = reporter;
    return this;
  }
    
  render(renderer: Renderer<T>) {
    this.handlers.render = renderer;
    return this;
  }
}