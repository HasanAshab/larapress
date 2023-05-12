import Middleware from "illuminate/middlewares/Middleware";
import { Request, Response, NextFunction } from "express";
import { passErrorsToHandler } from "illuminate/decorators/method";
import { File } from "types";
import path from "path";

export default class ValidateRequest extends Middleware {
  @passErrorsToHandler()
  handle(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> {
    try {
      var ValidationRule = require(base(path.join('app/http/validations/', this.options[0]))).default;
    } catch {
      return next();
    }
    const { urlencoded, multipart } = ValidationRule.schema;
    if (typeof urlencoded !== "undefined") {
      const { error } = urlencoded.rules.validate(req[urlencoded.target]);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }
    }

    if (typeof multipart !== "undefined") {
      const contentType = req.headers["content-type"];
      if (!contentType || !contentType.startsWith("multipart/form-data")) {
        return res.status(400).json({
          message: "Only multipart/form-data requests are allowed",
        });
      }
      this._parseFiles(req);
      const error = multipart.validate(req.files);
      if (error) {
        return res.status(400).json({
          message: error,
        });
      }
    }
    next();
  }

  _parseFiles(req: Request) {
    const files: {[key: string]: File | File[]} = {};
    req.files.forEach((file) => {
      if (files[file.fieldname]) {
        if (Array.isArray(files[file.fieldname])) {
          files[file.fieldname].push(file);
        } else {
          files[file.fieldname] = [files[file.fieldname], file];
        }
      } else {
        files[file.fieldname] = file;
      }
    });
    req.files = files;
  }
}