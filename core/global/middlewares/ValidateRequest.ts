import Middleware from "~/core/abstract/Middleware";
import { Request, Response, NextFunction } from "express";
import path from "path";
import { ValidationSchema } from "types";

export default class ValidateRequest extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    const { urlencoded, multipart } = this.config.validationSchema as ValidationSchema;
    if (multipart) {
      const contentType = req.headers["content-type"];
      if (!contentType || !contentType.startsWith("multipart/form-data")) {
        return res.status(400).message("Only multipart/form-data requests are allowed");
      }
      const error = multipart.validate(req.files ?? {});
      if (error) {
        return res.status(400).message(error);
      }
    }
    if (urlencoded) {
      const target = req[urlencoded.target];
      urlencoded.rules.validateAsync(target).then(() => next()).catch(error => {
        res.status(400).message(error.details ? error.details[0].message : error.message);
      });
    }
  }
}