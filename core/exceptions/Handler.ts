// shob CastError e r log hoibo na + prottec tai .stack nai
laravel

import { constructor } from "types";
import { Request, Response } from "express";
import Exception from "~/core/exceptions/Exception";

export type Renderer<T> = 
| ((this: T, res: Response) => any)
| ((this: T, req: Request, res: Response) => any);

export default class Handler {
  protected dontReport: constructor[] = [];
  private renderers = new Map<constructor, Renderer<any>>;

  constructor() {
    this.register();
  }
  
  register() {
    //
  }

  async handle(err: any, req: Request, res: Response) {
    const shouldReport = this.shouldReport(err);

    const renderer = this.getRendererFor(err, req);
    if(renderer) {
      renderer.length === 2
        ? renderer(req, res)
        : renderer(res);
      shouldReport && renderer.report();
    }
    
    else if(err instanceof Exception) {
      err.render(req, res);
      shouldReport && err.shouldReport && err.report(req);
    }
    
    if(!res.headersSent) {
      env("NODE_ENV") === "production"
        ? res.status(500).message()
        : res.status(500).json({ error: err.stack });
      
      shouldReport && log(`${new Date().toLocaleString()}\n${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${err.stack}`);
    }
  };
  
  protected on<T extends constructor>(exception: T) {
    const that = this;
    function dontReport() {
      that.dontReport.push(exception);
      return this;
    }
    
    function render(renderer: Renderer<T>) {
      that.renderers.set(exception, renderer);
      return this;
    }
    
    return { dontReport, render };
  }

  private getRendererFor(err: any, req: Request) {
    let renderer: Renderer<any> | null = null;
    for(const [ exception, rawRenderer ] of this.renderers.entries()) {
      if(err instanceof exception) {
         renderer = rawRenderer;
         break;
      }
    }
    
    if(!renderer) {
      return null;
    }
    
    //err.request = req;
    err.report = function() {
      return log(`${new Date().toLocaleString()}\n${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${this}`);
    }

    return renderer.bind(err);
  }
  
  private shouldReport(err) {
    return !this.dontReport.some(exception => err instanceof exception);
  }
}