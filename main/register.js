const path = require("path");
const fs = require("fs");
const cron = require("node-cron");
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
  const routes = {};
  const pushEndpoint = (path) => {
    const endpoint = path.replace(routesRootPath, '').split(".")[0];
    app.use(endpoint.toLowerCase(), require(path));
  };
  const setRoutes = (routesPath) => {
    const items = fs.readdirSync(routesPath);
    for (const item of items) {
      const itemPath = path.join(routesPath, item);
      const status = fs.statSync(itemPath);
      if (status.isFile()) {
        pushEndpoint(itemPath);
      } else if (status.isDirectory()) {
        setRoutes(itemPath);
      }
    }
  };
  setRoutes(routesRootPath);
  for (const [endpoint, routerPath] of Object.entries(routes)) {
  }
};

module.exports = {
  registerEvents,
  registerRoutes,
  registerTasks,
};
