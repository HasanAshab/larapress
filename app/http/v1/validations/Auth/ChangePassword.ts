import {
  ValidationSchema
} from "types";
import Joi from "joi";

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      oldPassword: Joi.string().required(),
      password: Joi.string().min(8).invalid(Joi.ref("oldPassword")).required(),
    })
  }
}

export default schema;