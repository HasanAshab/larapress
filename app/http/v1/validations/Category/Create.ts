import { ValidationSchema } from "types";
import Joi from "joi";
import FileValidator from "illuminate/utils/FileValidator";
import Category from "app/models/Category";

const schema: ValidationSchema = {
  urlencoded: {
    target: "body",
    rules: Joi.object({
      name: Joi.string().required(),
      slug: Joi.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug").required().external(async (slug) => {
        if (await Category.findOne({ slug })) throw new Error("this slug is already in use!");
      })
    })
  },
  multipart: FileValidator.schema({
    icon: FileValidator.optional().parts(1).max(1000*1000).mimetypes("image/jpeg", "image/png"),
  })
}

export default schema;