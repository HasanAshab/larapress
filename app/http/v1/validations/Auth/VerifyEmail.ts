import { ValidationSchema } from "types";
import Joi from "joi";

const schema: ValidationSchema = {
  urlencoded: {
    target: "params",
    rules: Joi.object({
      id: Joi.string().required(),
    })
  },
}

export default schema;