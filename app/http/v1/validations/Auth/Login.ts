import { ValidationSchema } from "types";
import Joi from "joi";

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    })
  }
}


export default schema;