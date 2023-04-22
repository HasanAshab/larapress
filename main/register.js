const events = require('../register/events');
const routes = require('../register/routes');
const path = require('path');

registerEvents = (app) => {
  Object.keys(events).forEach((key, index) => {
    for(const listenerName of events[key]){
      const listener = require(base(`app/listeners/${listenerName}`));
      app.on(key, listener);
    }
  });
}

registerRoutes = (app) => {
  Object.keys(routes).forEach((key, index) => {
    app.use(key, require(routes[key]));
  });
}

helpers = () => {
  const helpers = require(path.join(__dirname, '../helpers'));
  Object.keys(helpers).forEach((name) => {
    global[name] = helpers[name];
  })
}

module.exports = {
  helpers,
  registerEvents,
  registerRoutes,
};