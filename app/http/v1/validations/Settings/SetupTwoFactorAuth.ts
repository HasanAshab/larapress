import { ValidationSchema } from "types";
import Joi from "joi";
import otpConfig from "~/register/otp"

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      enabled: Joi.boolean(),
      method: Joi.string().valid(...otpConfig.methods)
    }),
  },
};

export default schema;
