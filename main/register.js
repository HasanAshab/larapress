const path = require('path');
const cron = require('node-cron');
const events = require(path.join(__dirname, '../register/events'));
const routes = require(path.join(__dirname, '../register/routes'));
const helpers = require(path.join(__dirname, '../helpers'));
const jobs = require(path.join(__dirname, '../register/jobs'));

registerHelpers = () => {
  for(const [name, helper] of Object.entries(helpers)){
    global[name] = helper;
  }
}

registerJobs = () => {
  const Artisan = require(path.join(__dirname, '../utils/Artisan'));
  for(const [command, schedule] of Object.entries(jobs)){
    cron.schedule(schedule, Artisan.getCommand(command));
  }
}

registerEvents = (app) => {
  for(const [event, listenerNames] of Object.entries(events)){
    for(const listenerName of listenerNames){
      const listener = require(base(`app/listeners/${listenerName}`));
      app.on(event, listener);
    }
  }
}

registerRoutes = (app) => {
  for(const [endpoint, routerPath] of Object.entries(routes)){
    app.use(endpoint, require(base(routerPath)));
  }
}

module.exports = {
  registerHelpers,
  registerEvents,
  registerRoutes,
  registerJobs,
};