const path = require('path');
const cron = require('node-cron');
const events = require(path.join(__dirname, '../register/events'));
const routes = require(path.join(__dirname, '../register/routes'));
const helpers = require(path.join(__dirname, '../helpers'));
const jobs = require(path.join(__dirname, '../register/jobs'));

registerEvents = (app) => {
  Object.keys(events).forEach((key, index) => {
    for(const listenerName of events[key]){
      const listener = require(path.join(__dirname, `../app/listeners/${listenerName}`));
      app.on(key, listener);
    }
  });
}

registerRoutes = (app) => {
  Object.keys(routes).forEach((key, index) => {
    app.use(key, require(routes[key]));
  });
}

registerHelpers = () => {
  Object.keys(helpers).forEach((name) => {
    global[name] = helpers[name];
  })
}

registerJobs = () => {
  const Artisan = require(path.join(__dirname, '../utils/Artisan'));
  for(const [command, schedule] of Object.entries(jobs)){
    cron.schedule(schedule, Artisan.getCommand(command));
  }
}

module.exports = {
  registerHelpers,
  registerEvents,
  registerRoutes,
  registerJobs,
};