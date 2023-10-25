export default {
  connect: true,
  url: env("DATABASE_URL"),
  options: {
    maxPoolSize: 1,
  }
};
