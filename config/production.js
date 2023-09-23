module.exports = {
  loadBalancer: {
    enabled: true,
  },
  mail: {
    host: "smtp-relay.sendinblue.com",
    port: 587,
  },
  cache: { default: "redis" },
  log: "file"
}