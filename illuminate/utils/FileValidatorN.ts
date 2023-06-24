import { UploadedFile } from "express-fileupload";

export default class FileValidator {
  public rules: {
    isMandatory: boolean;
    maxSize?: number;
    minSize?: number;
    parts?: number;
    maxParts?: number;
    minParts?: number;
    validMimetypes?: string[];
    custom?: ((file: UploadedFile) => string | null);
  };

  constructor(isMandatory: boolean) {
    this.rules = {
      isMandatory
    };
  }

  static schema(schema: Record < string, FileValidator >) {
    return {
      validate(files: Record < string, UploadedFile | UploadedFile[] >): string | null {
        for (const fieldName in schema) {
          const fileStack = Array.isArray(files[fieldName])? files[fieldName]: [files[fieldName]];
          const {
            rules
          } = schema[fieldName];
          if (!rules.isMandatory && !fileStack[0]) continue;
          if (rules.isMandatory && !fileStack[0]) return `The ${fieldName} field is required.`;
          if (rules.parts) {
            if (file.length !== rules.parts) return `The ${fieldName} field should have ${rules.parts} parts.`;
          } else {
            if (rules.maxParts && file.length > rules.maxParts) return `The ${fieldName} field should'n have more than ${rules.maxParts} parts.`;
            if (rules.minParts && file.length < rules.minParts) return `The ${fieldName} field should have at least ${rules.minParts} parts.`;
          }

          for (const file of fileStack) {
            if (rules.maxSize && file.size > rules.maxSize) return `The ${fieldName} field size shouldn't more than ${rules.maxSize / 1000}KB.`;
            if (rules.minSize && file.size < rules.minSize) return `The ${fieldName} field size should be at least ${rules.minSize / 1000}KB.`;
            if (rules.validMimetypes && !rules.validMimetypes.includes(file.mimetype)) return `The ${fieldName} field mimetype should be ${rules.validMimetypes.join(" or ")}.`;
          }
        }
        return null;
      }
    }
  }

  static required() {
    return new this(true)
  }

  static optional() {
    return new this(false)
  }

  max(bytes: number) {
    this.rules.maxSize = bytes;
    return this;
  }

  min(bytes: number) {
    this.rules.minSize = bytes;
    return this;
  }

  parts(count: number) {
    this.rules.parts = count;
    return this;
  }

  maxParts(count: number) {
    this.rules.parts ?? this.rules.maxParts = count;
    return this;
  }

  minParts(count: number) {
    this.rules.parts ?? this.rules.minParts = count;
    return this;
  }

  mimetypes(validMimetypes: string[]) {
    this.rules.validMimetypes = validMimetypes;
    return this;
  }

  custom(cb: ((file: UploadedFile) => string | null)) {
    this.rules.custom = cb;
    return this;
  }

}