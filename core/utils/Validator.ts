import Joi, { AnySchema } from "joi";

export default Joi.extend((joi) => ({
  type: "file",
  base: joi.any(),
  messages: {
    "file.base": "{{#label}} should be a file",
    "file.size.max": "{{#label}} size shouldn't more than {{#size}} bytes",
    "file.size.min": "{{#label}} size should be at least {{#size}} bytes",
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
          ref: true,
          assert: Joi.number().integer().min(0).required(),
          message: "must be a positive integer",
        },
      ],
      validate(files, helpers, { size }) {
        return files.every(file => file.size <= size)
          ? files
          : helpers.error("file.size.max", { size });
      },
    },
    min: {
      method(size: number) {
        return this.$_addRule({ name: "min", args: { size } });
      },
      args: [
        {
          name: "size",
          ref: true,
          assert: Joi.number().integer().min(0).required(),
          message: "must be a positive integer",
        },
      ],
      validate(files, helpers, { size }) {
        return files.every(file => file.size >= size)
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
          ref: true,
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
          ref: true,
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
          ref: true,
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
          ref: true,
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
        return this.$_addRule({ name: "mimetype", args: { types } });
      },
      args: [
        {
          name: "types",
          ref: true,
          assert: Joi.array().items(Joi.string()).required(),
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


