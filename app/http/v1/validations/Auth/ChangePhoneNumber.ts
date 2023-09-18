import { ValidationSchema } from "types";
import Joi from "joi";
import twilio from "twilio";

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      phoneNumber: Joi.string().required(),
      otp: Joi.string()
    }),
  },
};

export default schema;
