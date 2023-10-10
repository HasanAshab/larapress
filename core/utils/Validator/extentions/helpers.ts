import sanitizeHtml from 'sanitize-html';

export default function(joi) {
  const passwordPatterns = {
    strong: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/,
    medium: /(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})/,
    weak: /(?=.{6,})/,
  };
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  
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
            assert: joi.string().valid(...Object.keys(passwordPatterns)).required(),
          },
        ],
        validate(value, helpers, { strength }) {
          return passwordPatterns[strength].test(value)
            ? value
            : helpers.error("string.password." + strength);
        },
      },
      slug: {
        validate(value, helpers, { strength }) {
          return slugPattern.test(value)
            ? value
            : helpers.error("string.slug");
        },
      },
      sanitize: {
        validate(value, helpers) {
          return sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {}
          });
        }
      },
    }
  }
}
