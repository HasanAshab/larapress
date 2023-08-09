import { ValidationSchema } from "types";
import Joi from "joi";
import twilio from "twilio";

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      method: Joi.string().valid("sms", "call").required(),
      otp: Joi.number().required()
    }),
  },
};

export default schema;
