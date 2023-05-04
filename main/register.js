const cron = require("node-cron");
const swaggerUi = require('swagger-ui-express');
const Artisan = require(base("illuminate/utils/Artisan"));
const events = require(base("register/events"));
const tasks = require(base("register/tasks"));

const registerTasks = () => {
  for (const [command, schedule] of Object.entries(tasks)) {
    cron.schedule(schedule, Artisan.getCommand(command));
  }
};

const registerEvents = (app) => {
  for (const [event, listenerNames] of Object.entries(events)) {
    for (const listenerName of listenerNames) {
      const listener = require(base(`app/listeners/${listenerName}`)).dispatch;
      app.on(event, listener);
    }
  }
};

const registerRoutes = (app) => {
  const routesRootPath = base("routes");
  generateEndpointsFromDirTree(routesRootPath, (endpoint, path) => {
    app.use(endpoint, require(path));
  });
};

module.exports = {
  registerEvents,
  registerRoutes,
  registerTasks,
};
