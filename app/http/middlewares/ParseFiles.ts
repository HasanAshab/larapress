import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import { passErrorsToHandler } from "illuminate/decorators/method";
import { File } from "types";

export default class ParseFiles extends Middleware {
  @passErrorsToHandler()
  handle(req: Request, res: Response, next: NextFunction) {
    const files: {[key: string]: File | File[]} = {};
    (req.files as any[]).forEach((file: File) => {
      const fileStack = files[file.fieldname];
      if (fileStack) {
        if (Array.isArray(fileStack)) {
          (files[file.fieldname] as File[]).push(file);
        } else {
          files[file.fieldname] = [fileStack, file];
        }
      } else {
        files[file.fieldname] = file;
      }
    });
    (req as any).files = files;
    next();
  }
}