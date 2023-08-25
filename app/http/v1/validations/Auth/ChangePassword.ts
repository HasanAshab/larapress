import { ValidationSchema } from "types";
import Joi from "joi";

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      oldPassword: Joi.string().required(),
      password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$'))
        .message('"{#label}" must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@ $ ! % * ? &)')
    })
  }
}

export default schema;