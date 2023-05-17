import { UploadedFile } from "express-fileupload";
import FileValidator from "illuminate/utils/FileValidator";
import FileValidatorError from "illuminate/exceptions/utils/FileValidatorError";

const validators: {[key: string]: (value: any) => void } = {
  max(bytes: number) {
    if (FileValidator.file.size > bytes) {
      throw FileValidatorError.type("TOO_LARGE_FILE").create({
        fieldName: FileValidator.fieldName,
        size: `${bytes / 1000000} MB!`,
      });
    }
  },
  min(bytes: number) {
    if (FileValidator.file.size < bytes) {
      throw FileValidatorError.type("TOO_SMALL_FILE").create({
        fieldName: FileValidator.fieldName,
        size: `${bytes / 1000000} MB!`,
      });
    }
  },

  mimetypes(validMimetypes: string[]) {
    if (!validMimetypes.includes(FileValidator.file.mimetype)) {
      throw FileValidatorError.type("INVALID_MIMETYPE").create({
        fieldName: FileValidator.fieldName,
        mimetypes: validMimetypes.join(" or "),
      });
    }
  },

   custom(cb: ((file: UploadedFile) => void)) {
    cb(FileValidator.file);
  }
}

export default validators;