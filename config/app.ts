export default {
  name: "Samer",
  protocol: "http",
  domain: "127.0.0.1",
  port: env("PORT", 8000),
  key: env("APP_KEY", null),
  state: "up",
  vapid: {
    publicKey: null,
    privateKey: null
  },
  log: "console",

  providers: [
    "Storage/StorageServiceProvider",
    "Queue/QueueServiceProvider",
    "Cache/CacheServiceProvider",
    "DB/DatabaseServiceProvider",
    "~/app/providers/EventServiceProvider",
    "~/app/providers/RouteServiceProvider",
    "~/app/providers/ConsoleServiceProvider",
    "~/app/providers/CronJobServiceProvider",
    "~/app/providers/LockServiceProvider",
    "~/app/providers/AppServiceProvider",
    "Socialite/SocialiteServiceProvider",
  ]
};
