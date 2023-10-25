export default   {
  default: "memory",
  stores: {
    memory: {},
    redis: {
      url: env("REDIS_URL"),
      host: env("REDIS_HOST"),
      port: env("REDIS_PORT"),
      password: env("REDIS_PASSWORD"),
      maxRetriesPerRequest: null,
      enableReadyCheck: false
    },
  }
}
