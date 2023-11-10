import { UserDocument } from "~/app/models/User";
import { Request } from 'express';
import Joi from "joi";

interface RequestClass extends Request {}
class RequestClass {
  static rules() {
    return {} as Record<string, Joi.AnySchema>;
  }
}


class AuthenticRequest extends RequestClass {
  user!: UserDocument;
}
  
function isRequest(target: any): target is typeof RequestClass {
  return target === RequestClass || target.prototype instanceof RequestClass;
}

export { RequestClass as Request, AuthenticRequest, isRequest };