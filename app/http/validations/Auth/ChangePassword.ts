import {
  ValidationSchema
} from "types";
import Joi from "joi";

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      old_password: Joi.string().required(),
      password: Joi.string().min(8).required(),
    })
  }
}

export default schema;