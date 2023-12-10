import { AuthenticRequest } from "~/core/express";
import Validator, { unique } from "Validator";
import { UploadedFile } from "express-fileupload";

interface UpdateCategoryRequest {
  body: { 
    name?: string;
    slug?: string;
  }
  
  files: {
    icon: UploadedFile
  }
}

class UpdateCategoryRequest extends AuthenticRequest {
  static rules() {
    return {
      name: Validator.string(),
      slug: Validator.string().slug().external(unique("Category", "slug")),
      icon: Validator.file().parts(1).max(1000*1000).mimetypes(["image/jpeg", "image/png"]),
    }
  }
}

export default UpdateCategoryRequest;