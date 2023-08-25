import { ValidationSchema } from "types";
import Joi from "joi";
import otpConfig from "~/register/otp"

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      userId: Joi.string().required(),
      method: Joi.string().valid(...otpConfig.methods).required()
    })
  }
}

export default schema;