import {
  ValidationSchema
} from "types";
import Joi from "joi";

const schema: ValidationSchema = {
  urlencoded: {
    target: "query",
    rules: Joi.object({
      id: Joi.string().required(),
      token: Joi.string().required(),
    })
  }
}

export default schema;