import Middleware from "illuminate/middlewares/Middleware";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { ApiResponse, RawResponse } from "types";
import URL from "illuminate/utils/URL";
import Token from "app/models/Token";


export default class InjectHelpers extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    res.api = function (response: RawResponse) {
      const defaultErrorMessages: Record<number, string> = {
        404: "Resource Not Found!",
        401: "Unauthorized"
      }
      const apiResponse: ApiResponse = {
        success: this.statusCode >= 200 && this.statusCode < 300,
        data: {}
      }
      if(Array.isArray(response)) {
        apiResponse.data = response;
      }
      else if(response instanceof mongoose.Document){
        apiResponse.data = response;
      }
      else {
        for (const [key, value] of Object.entries(response)) {
          if (key === "data") apiResponse.data = value;
          else if (key === "message") apiResponse.message = value;
          else {
            Array.isArray(apiResponse.data)
              ? apiResponse[key] = value
              : apiResponse.data[key] = value;
          }
        }
      }
      if(!("message" in response))
        apiResponse.message = defaultErrorMessages[this.statusCode];
      this.json(apiResponse);
    };

    next();
  }
}
