const path = require('path');
const cron = require('node-cron');
const Artisan = require(base('illuminate/utils/Artisan'));
const events = require(base('register/events'));
const routes = require(base('register/routes'));
const tasks = require(base('register/tasks'));

const registerTasks = () => {
  for(const [command, schedule] of Object.entries(tasks)){
    cron.schedule(schedule, Artisan.getCommand(command));
  }
}

const registerEvents = (app) => {
  for(const [event, listenerNames] of Object.entries(events)){
    for(const listenerName of listenerNames){
      const listener = require(base(`app/listeners/${listenerName}`));
      app.on(event, listener);
    }
  }
}

const registerRoutes = (app) => {
  for(const [endpoint, routerPath] of Object.entries(routes)){
    app.use(endpoint, require(base(routerPath)));
  }
}

module.exports = {
  registerEvents,
  registerRoutes,
  registerTasks,
};