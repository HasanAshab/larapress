import Middleware from "~/core/middlewares/Middleware";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { ApiResponse, RawResponse } from "types";
import { messages } from "~/register/error";

export default class InjectHelpers extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    res.api = function (response: RawResponse) {
      const success = this.statusCode >= 200 && this.statusCode < 300;
      response.message = response.message || messages[this.statusCode];
      
      if(response.data) {
        response.success = response.success ?? success;
        return this.json(response);
      }
      
      const apiResponse: ApiResponse = { success };
      apiResponse.message = response.message
      delete response.message;
      apiResponse.data = response;
      return this.json(apiResponse);
    };

    next();
  }
}
