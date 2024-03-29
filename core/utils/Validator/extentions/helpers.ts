// @ts-nocheck
import Joi, { StringSchema, AnySchema, CustomHelpers } from 'joi';
import sanitizeHtml from 'sanitize-html';


// Define the types for your custom Joi extension
declare module 'joi' {
  interface CustomHelpers {
    password(strength: keyof typeof passwordPatterns): StringSchema;
    slug(): StringSchema;
    sanitize(): StringSchema;
  }

  interface StringSchema {
    password(strength?: keyof typeof passwordPatterns): StringSchema;
    slug(): StringSchema;
    sanitize(): StringSchema;
  }
}

const passwordPatterns = {
  strong: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/,
  medium: /(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})/,
  weak: /(?=.{6,})/,
};
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Create and export the custom Joi extension
export default function (joi: AnySchema) {
  return {
    type: 'string',
    base: joi.string(),
    messages: {
      'string.password.strong': '{#label} must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@ $ ! % * ? &)',
      'string.password.medium': '{#label} should be at least 6 characters long and include both letters and numbers',
      'string.password.weak': '{#label} should be at least 6 characters long',
      'string.slug': '{#label} is not a valid slug',
      'string.unique': '{#label} already exists',
    },
    rules: {
      password: {
        method(this: StringSchema, strength: keyof typeof passwordPatterns = 'strong') {
          return this.$_addRule({ name: 'password', args: { strength } });
        },
        args: [
          {
            name: 'strength',
            assert: joi.string().valid(...Object.keys(passwordPatterns)).required(),
          },
        ],
        validate: (value, helpers, { strength }) =>
          passwordPatterns[strength].test(value)
            ? value
            : helpers.error('string.password.' + strength),
      },
      slug: {
        validate(value, helpers) {
          return slugPattern.test(value) ? value : helpers.error('string.slug');
        },
      },
      sanitize: {
        validate(value, helpers) {
          return sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {},
          });
        },
      },
    },
  };
}
