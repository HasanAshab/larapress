import { ValidationSchema } from "types";
import Joi from "joi";

const schema: ValidationSchema = {
  urlencoded: {
    target: "query",
    rules: Joi.object({
      query: Joi.string().required(),
      status: Joi.string().valid("open", "closed")
    })
  }
}


export default schema;