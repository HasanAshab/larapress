import { ValidationSchema } from "types";
import Joi from "joi";

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      id: Joi.string().required(),
      password: Joi.string().min(8).required(),
      token: Joi.string().required()
    }),
  },
};

export default schema;
