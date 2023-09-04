import { ValidationSchema } from "types";
import Joi from "joi";

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      status: Joi.string().valid("opened", "closed").required()
    })
  }
}


export default schema;