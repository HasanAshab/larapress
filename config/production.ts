module.exports = {
  loadBalancer: {
    enabled: true,
  },
  mail: {
    host: "smtp-relay.sendinblue.com",
    port: 587,
  },
  cache: "redis",
  log: "file"
}