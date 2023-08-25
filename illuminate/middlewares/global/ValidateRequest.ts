import Middleware from "~/illuminate/middlewares/Middleware";
import {
  Request,
  Response,
  NextFunction
} from "express";
import path from "path";
import { ValidationSchema } from "types"
export default class ValidateRequest extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    const {
      version,
      validationSubPath
    } = this.config;
    if (typeof version !== "string" || typeof validationSubPath !== "string") throw new Error("version and validationSubPath args required as type String.");

    try {
      const Schema = require(path.join(`app/http/${version}/validations/`, validationSubPath));
      var ValidationSchema = Schema.default as ValidationSchema;
    } catch(err: any) {
      if (err.code === "MODULE_NOT_FOUND") return next();
      else throw err;
    }
    const urlencoded = ValidationSchema.urlencoded;
    const multipart = ValidationSchema.multipart;

    if (typeof multipart !== "undefined") {
      const contentType = req.headers["content-type"];
      if (!contentType || !contentType.startsWith("multipart/form-data")) {
        return res.status(400).api({
          message: "Only multipart/form-data requests are allowed",
        });
      }
      const error = multipart.validate(req.files ?? {});
      if (error) {
        return res.status(400).api({
          message: error,
        });
      }
    }

    if (typeof urlencoded !== "undefined") {
      const target = req[urlencoded.target];
      urlencoded.rules.validateAsync(target).then(() => {
        req.validated = target;
        next();
      }).catch(error => {
        res.status(400).api({
          message: error.details ? error.details[0].message: error.message,
        });
      })
    }
  }

}