import Middleware from "illuminate/middlewares/Middleware";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { ApiResponse, RawResponse } from "types";
import URL from "illuminate/utils/URL";
import Token from "illuminate/utils/Token";


export default class InjectHelpers extends Middleware {
  handle(req: Request, res: Response, next: NextFunction) {
    req.hasValidSignature = function () {
      const { sign } = this.query;
      return typeof sign === "string" && Token.isValid(this.baseUrl + this.path, sign);
    };

    res.api = function (response: RawResponse): void {
      const defaultErrorMessages: Record<number, string> = {
        404: "Resource Not Found!",
        401: "Unauthorized",
      };

      this.statusCode = (response as any).status ?? this.statusCode;
      const success = this.statusCode >= 200 && this.statusCode < 300;

      const apiResponse: ApiResponse = {
        success,
        data: Array.isArray(response) ? response : {},
      };

      if (!Array.isArray(response)) {
        if (response instanceof mongoose.Document) {
          apiResponse.data = response.toObject();
        } else {
          for (const key in response) {
            const value = response[key];
            if (key === "data") {
              apiResponse.data = value;
            } else if (key === "message") {
              apiResponse.message = value;
            } else {
              if (Array.isArray(apiResponse.data)) {
                apiResponse[key] = value;
              } else {
                apiResponse.data[key] = value;
              }
            }
          }
        }

        if (typeof apiResponse.message === "undefined") {
          apiResponse.message = defaultErrorMessages[this.statusCode];
        }
      }

      this.json(apiResponse);
    };

    next();
  }
}
