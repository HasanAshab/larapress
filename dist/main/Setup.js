"use strict";
/*
import { generateEndpointsFromDirTree } = require(base("illuminate/utils"));
const nodeCron = require("node-cron");
const swaggerUi = require('swagger-ui-express');
const Artisan = require(base("illuminate/utils/Artisan"));
const events = require(base("register/events"));
const crons = require(base("register/cron"));

const registerCronJobs = () => {
  for (const [command, schedule] of Object.entries(crons)) {
    nodeCron.schedule(schedule, Artisan.getCommand(command));
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
  registerCronJobs,
};
*/ 
