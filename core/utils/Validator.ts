import Joi, { AnySchema } from "joi";

/*
let Validator = Joi.extend((joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.password": "{#label} must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@ $ ! % * ? &)",
  }
  
}))
*/
let Validator = Joi.extend((joi) => ({
  type: "file",
  base: joi.any(),
  messages: {
    "file.base": "{{#label}} should be a file",
    "file.size.max": "{{#label}} size shouldn't more than {{#size}} MB",
    "file.size.min": "{{#label}} size should be at least {{#size}} MB",
    "file.parts": "{{#label}} should have {{#count}} parts",
    "file.parts.max": "{{#label}} shouldn't have more than {{#count}} parts",
    "file.parts.min": "{{#label}} should have at least {{#count}} parts",
    "file.mimetype": "{{#label}} must have a mime type of {{#type}}",
    "file.mimetypes": "{{#label}} must have at least one mime type of {{#types}}",
  },
  validate(value, helpers) {
    return typeof value === "object"
      ? { value: Array.isArray(value) ? value : [value] }
      : { value, errors: helpers.error("file.base") };
  },

  rules: {
    max: {
      method(size: number) {
        return this.$_addRule({ name: "max", args: { size } });
      },
      args: [
        {
          name: "size",
          assert: Joi.number().integer().min(0).required(),
          message: "must be a positive integer",
        },
      ],
      validate(files, helpers, { size }) {
        return files.every(file => file.size <= size * 1000000)
          ? files
          : helpers.error("file.size.max", { size: size });
      },
    },
    min: {
      method(size: number) {
        return this.$_addRule({ name: "min", args: { size } });
      },
      args: [
        {
          name: "size",
          assert: Joi.number().integer().min(0).required(),
          message: "must be a positive integer",
        },
      ],
      validate(files, helpers, { size }) {
        return files.every(file => file.size >= size * 1000000)
          ? files
          : helpers.error("file.size.min", { size });
      },
    },
    parts: {
      method(count: number) {
        return this.$_addRule({ name: "parts", args: { count } });
      },
      args: [
        {
          name: "count",
          assert: Joi.number().integer().min(1).required(),
          message: "must be at least 1",
        },
      ],
      validate(files, helpers, { count }) {
        return files.length === count
          ? files
          : helpers.error("file.parts", { count });
      },
    },
    maxParts: {
      method(count: number) {
        return this.$_addRule({ name: "maxParts", args: { count } });
      },
      args: [
        {
          name: "count",
          assert: Joi.number().integer().min(1).required(),
          message: "must be at least 1",
        },
      ],
      validate(files, helpers, { count }) {
        return file.length <= count
          ? files
          : helpers.error("file.parts.max", { count });
      },
    },
    minParts: {
      method(count: number) {
        return this.$_addRule({ name: "minParts", args: { count } });
      },
      args: [
        {
          name: "count",
          assert: Joi.number().integer().min(1).required(),
          message: "must be at least 1",
        },
      ],
      validate(files, helpers, { count }) {
        return files.length >= count
          ? file
          : helpers.error("file.parts.min", { count });
      },
    },
    mimetype: {
      method(type: string) {
        return this.$_addRule({ name: "mimetype", args: { type } });
      },
      args: [
        {
          name: "type",
          assert: Joi.string().required(),
          message: "must be a string",
        },
      ],
      validate(files, helpers, { type }) {
        return files.every(file => file.mimetype === type)
          ? files
          : helpers.error("file.mimetype", { type });
      },
    },
    mimetypes: {
      method(types: string[]) {
        return this.$_addRule({ name: "mimetypes", args: { types } });
      },
      args: [
        {
          name: "types",
          assert: Joi.array().items(Joi.string().required()).required(),
          message: "must be an array of string",
        },
      ],
      validate(files, helpers, { types }) {
        return files.every(file => types.includes(file.mimetype))
          ? files
          : helpers.error("file.mimetypes", { types });
      },
    },
  },
}));


export default Validator;