import { ValidationSchema } from "types";
import Joi from "joi";

const schema: ValidationSchema = {
  urlencoded: {
    target: "query",
    rules: Joi.object({
      query: Joi.string().required(),
      status: Joi.string().valid("opened", "closed"),
      limit: Joi.string(),
      cursor: Joi.string()
    })
  }
}


export default schema;