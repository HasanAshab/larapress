import { ValidationSchema } from "types";
import Joi from "joi";
import { methods } from "~/register/otp"

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      enable: Joi.boolean(),
      method: Joi.string().valid(...methods)
    }),
  },
};

export default schema;
