import { ValidationSchema } from "types";
import Joi from "joi";
import config from "config";

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      enable: Joi.boolean(),
      method: Joi.string().valid(...config.get("twoFactorAuth.methods"))
    }),
  },
};

export default schema;
