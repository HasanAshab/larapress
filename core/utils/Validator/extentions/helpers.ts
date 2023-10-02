import sanitizeHtml from 'sanitize-html';

export default function(joi) {
  return {
    type: "string",
    base: joi.string(),
    messages: {
      "string.password.strong": "{#label} must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@ $ ! % * ? &)",
      "string.password.medium": "{#label} should be at least 6 characters long and include both letters and numbers",
      "string.password.weak": "{#label} should be at least 6 characters long",
      "string.unique": "{#label} already exists",
    },
    rules: {
      password: {
        method(strength: keyof typeof passwordPatterns = "strong") {
          return this.$_addRule({ name: "password", args: { strength } });
        },
        args: [
          {
            name: "strength",
            assert: Joi.string().valid(...Object.keys(passwordPatterns)).required(),
          },
        ],
        validate(value, helpers, { strength }) {
          return passwordPatterns[strength].test(value)
            ? value
            : helpers.error("string.password." + strength);
        },
      },
      sanitize: {
        validate(value, helpers) {
          return sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {}
          });
        }
      }
    }
  }
}
