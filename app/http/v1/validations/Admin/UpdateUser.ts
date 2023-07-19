import { ValidationSchema } from "types";
import Joi from "joi";

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      name: Joi.string().min(3).max(12),
      email: Joi.string().email(),
      isAdmin: Joi.boolean()
    })
  }
}


export default schema;