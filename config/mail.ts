export default {
  host: env("MAIL_HOST"),
  port: env("MAIL_PORT"),
  username: env("MAIL_USERNAME", ""),
  password: env("MAIL_PASSWORD", ""),
  fromName: "Samer",
  fromAddress: "noreply@Samer.com",
  encryption: env("MAIL_ENCRYPTION"),
  template: {
    viewEngine: {
      layoutsDir: "views/layouts",
      partialsDir: "views/partials",
    },
    viewPath: "views/emails"
  }
}
