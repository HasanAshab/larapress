import { ValidationSchema } from "types";
import User from "app/models/User";
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