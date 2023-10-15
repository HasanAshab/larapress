module.exports = {
  loadBalancer: {
    enabled: true,
  },
  recaptcha: {
    siteKey: "6LcCwIknAAAAANu-Lsiie8YIRWVLzTRXV9n0Qu-l",
    secretKey: "6LcCwIknAAAAAJ4bLQ5z-56oXcmtK6GQGvhL3r9J"
  },
  mail: {
    host: "smtp-relay.sendinblue.com",
    port: 587,
  },
  cache: "redis",
  log: "file"
}