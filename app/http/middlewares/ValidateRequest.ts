import Middleware from "illuminate/middlewares/Middleware";
import { Response, NextFunction } from "express";
import { Request } from "types";
import { passErrorsToHandler } from "illuminate/decorators/method";
import { base } from "helpers";
import path from "path";

export default class ValidateRequest extends Middleware {
  @passErrorsToHandler()
  handle(req: Request, res: Response, next: NextFunction) {
    try {
      var ValidationRule = require(base(path.join('app/http/validations/', this.options[0]))).default;
    } catch {
      next();
    }
    const { urlencoded, multipart } = ValidationRule.schema;
    if (typeof urlencoded !== "undefined") {
      const { error } = urlencoded.rules.validate(req[urlencoded.target as "body" | "params" | "query"]);
      if (error) {
        res.status(400).json({
          message: error.details[0].message,
        });
      }
    }

    if (typeof multipart !== "undefined") {
      const contentType = req.headers["content-type"];
      if (!contentType || !contentType.startsWith("multipart/form-data")) {
        res.status(400).json({
          message: "Only multipart/form-data requests are allowed",
        });
      }
      const error = multipart.validate(req.files);
      if (error) {
        res.status(400).json({
          message: error,
        });
      }
    }
    next();
  }
}