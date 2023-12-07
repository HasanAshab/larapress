import { Request, Response } from "express";

export default abstract class Exception {
  shouldReport = false;
  
  abstract render(req: Request, res: Response): void;
  
  report(req: Request) {
    log(`${new Date().toLocaleString()}\n${req.originalUrl} - ${req.method} - ${req.ip}\nStack: ${this}`);
  }
}