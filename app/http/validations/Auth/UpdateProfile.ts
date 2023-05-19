import { ValidationSchema } from "types";
import Joi from "joi";
import FileValidator from "illuminate/utils/FileValidator";

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      name: Joi.string().min(3).max(12).required(),
      email: Joi.string().email().required(),
    }),
  },
  multipart: FileValidator.fields({
    logo: new FileValidator()
      .max(1000 * 1000)
      .maxLength(1)
      .mimetypes(["image/jpeg", "image/png"]),
  }),
};

export default schema;
