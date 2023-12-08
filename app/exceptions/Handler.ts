import ExceptionHandler from "~/core/exceptions/Handler";
import { JsonWebTokenError } from "jsonwebtoken";
import { ValidationError } from "Validator";
import { CastError } from "mongoose";

export default class Handler extends ExceptionHandler {
  /**
   * Handle application errors
  */
  register() {
    this.on(CastError)
      .render(function(res) {
        if(this.kind === "ObjectId" && this.path === "_id") {
          res.status(404).message("Resource Not Found");
        }
      })
     .report(function() {
        if(this.kind === "ObjectId" && this.path === "_id") {
          return false;
        }
      });


    this.on(JsonWebTokenError).dontReport().render(function(res) {
      res.status(401).message("Invalid or expired token!");
    });
    
    
    this.on(ValidationError).dontReport().render(function(res) {
      const errors = this.details.reduce((errors: Record<string, string>, detail: any) => {
        const field = detail.path[0];
        errors[field] = detail.message;
        return errors;
      }, {});
      
      res.status(422).json({
        success: false,
        errors
      });
    });
    
  }
}