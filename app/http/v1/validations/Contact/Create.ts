import { ValidationSchema } from "types";
import Joi from "joi";

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      email: Joi.string().email().required(),
      subject: Joi.string().min(5).max(72).required(),
      message: Joi.string().min(20).max(300).required()
    })
  }
}


export default schema;