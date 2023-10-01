import Middleware from "~/core/abstract/Middleware";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { ApiResponse, RawResponse } from "types";
import config from "config";

export default class InjectHelpers extends Middleware {
  async handle(req: Request, res: Response, next: NextFunction) {
    const messages = config.get("errorMessages");
    
    res.message = function (text?: string) {
      this.json({
        success: this.statusCode >= 200 && this.statusCode < 300,
        message: text ?? messages[this.statusCode]
      });
    }

    res.api = function (response: RawResponse) {
      const success = this.statusCode >= 200 && this.statusCode < 300;
      (response as any).message = (response as any).message ?? messages[this.statusCode];
      
      if((response as any).data) {
        (response as any).success = (response as any).success ?? success;
        this.json(response);
        return response as ApiResponse;
      }
      
      const apiResponse: ApiResponse = { success };
      apiResponse.message = (response as any).message
      delete (response as any).message;
      apiResponse.data = response;
      this.json(apiResponse);
    };

    next();
  }
}
