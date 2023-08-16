import { ValidationSchema } from "types";
import Joi from "joi";
import FileValidator from "illuminate/utils/FileValidator";
import User from "app/models/User";

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      username: Joi.string().alphanum().min(3).max(12).required().external(async (username) => {
        if (await User.findOne({ username })) throw new Error("username already exists!");
      }),
      email: Joi.string().email().required().external(async (email) => {
        if (await User.findOne({ email })) throw new Error("email already exists!");
      }),
      password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$'))
        .message('"{#label}" must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@ $ ! % * ? &)')
    })
  },
  multipart: FileValidator.schema({
    logo: FileValidator.optional().parts(1).max(1000*1000).mimetypes("image/jpeg", "image/png"),
  })
}

export default schema;