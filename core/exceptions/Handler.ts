import { constructor } from "types";
import { Request, Response } from "express";
import Exception from "./Exception";


export type Reporter<Ctx = any> = (this: Ctx) => Promise<boolean> | boolean;

export interface Renderer<Ctx = any> {
  (this: Ctx, res: Response): Promise<void> | void;
  (this: Ctx, req: Request, res: Response): Promise<void> | void;
}

interface Handlers<Ctx = any> {
  report: Reporter<Ctx>;
  render: Renderer<Ctx>;
}


export default class Handler {
  // TODO optimize
  protected dontReport: constructor[] = [];
  private exceptions = new Map<constructor, Partial<Handlers>>;
  
  constructor() {
    this.register();
  }
  
  register() {
    //
  }
  
  async handle(err: any, req: Request, res: Response) {
    const { report, render } = this.getHandlerOf(err);

    if(this.shouldReport(err) && await report() !== false) {
      this.report(err);
    }
  
    render.length === 2
      ? await render(req, res)
      : await render(res);

    !res.headersSent && this.render(err, res);
  }

  protected on<T extends constructor>(exception: T) {
    const that = this;
    
    this.exceptions.set(exception, {});

    function dontReport() {
      that.dontReport.push(exception);
      return this;
    }
    
    function report(reporter: Reporter<T>) {
      const handlers = that.exceptions.get(exception);
      handlers.report = reporter;
      that.exceptions.set(exception, handlers);
      return this;
    }
    
    function render(renderer: Renderer<T>) {
      const handlers = that.exceptions.get(exception);
      handlers.render = renderer;
      that.exceptions.set(exception, handlers);
      return this;
    }
    
    return { dontReport, report, render };
  }

  private getHandlerOf(err: any) {
    const handlers = {} as Handlers;

    if(err instanceof Exception) {
      handlers.report = err.report?.bind(err);
      handlers.render = err.render?.bind(err);
    }
    
    if(handlers.report && handlers.render) {
      return handlers;
    }
    
    for(const [exception, exceptionHandlers] of this.exceptions.entries()) {
      if(err instanceof exception) {
        handlers.report = exceptionHandlers.report?.bind(err);
        handlers.render = exceptionHandlers.render?.bind(err);
        break;
      }
    }
    
    handlers.report = handlers.report ?? (() => true);
    handlers.report = handlers.report ?? (() => {});
    
    return handlers;
  }
  
  
  private shouldReport(err: any) {
    if(err instanceof Exception) {
      return err.shouldReport;
    }
    return !this.dontReport.some(exception => err instanceof exception);
  }
  
  private async report(err: any) {
    await log(`\n\n${new Date().toLocaleString()}\n${err}\nStack: ${err.stack}`);
  }
  
  private render(err: any, res: Response) {
    env("NODE_ENV") === "production"
      ? res.status(500).message()
      : res.status(500).json({ error: err.stack });
  }
}