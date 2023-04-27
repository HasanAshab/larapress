const path = require('path');
const cron = require('node-cron');
const Artisan = require(base('illuminate/utils/Artisan'));
const events = require(base('register/events'));
const routes = require(base('register/routes'));
const jobs = require(base('register/jobs'));

const registerJobs = () => {
  for(const [command, schedule] of Object.entries(jobs)){
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
  registerJobs,
};