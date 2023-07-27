import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import { storage } from "helpers";
import fs from "fs";

export default class TracePerformance extends Middleware {
  handle(req: Request, res: Response, next: NextFunction) {
    const usageBefore = process.memoryUsage();
  const startTime = process.hrtime();

  res.on('finish', () => {
    const usageAfter = process.memoryUsage();
    const memoryUsed = usageAfter.heapUsed - usageBefore.heapUsed;

    const endTime = process.hrtime(startTime);
    const timeTaken = (endTime[0] * 1000 + endTime[1] / 1e6).toFixed(2);

      const data = `Route: ${req.method} ${req.originalUrl}\n
        Memory used: ${memoryUsed/1000} MB\n
        Time taken: ${timeTaken} ms\n\n`;
        if(process.env.LOG === "file"){
          fs.appendFile(storage("logs/performance.log"), data, (err: any) => {
              if (err)
                throw err;
          });
        }
        else if(process.env.LOG === "console"){
          console.log(data)
        }
    });
  
    next();
  }
}