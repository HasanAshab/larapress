import { ValidationSchema } from "types";
import Joi from "joi";
import otpConfig from "~/register/otp"

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      method: Joi.string().valid(...otpConfig.methods).required(),
      otp: Joi.number().required()
    }),
  },
};

export default schema;
