import { ValidationSchema } from "types";
import Joi from "joi";
import FileValidator from "illuminate/utils/FileValidator";
import User from "app/models/User";

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      name: Joi.string().min(3).max(12),
      email: Joi.string().email().external(async (email) => {
        if (await User.findOne({ email })) throw new Error("email already exists!");
      })
    }),
  },
  multipart: FileValidator.schema({
    logo: FileValidator.optional().parts(1).max(1000*1000).mimetypes("image/jpeg", "image/png"),
  }),
};

export default schema;
