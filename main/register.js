const events = require('../register/events');
const routes = require('../register/routes');
const path = require('path');

registerEvents = (app) => {
  const { event, listener } = require('../helpers');
  Object.keys(events).forEach((key, index) => {
    const Event = event(key);
    for(const listenerName of events[key]){
      const Listener = listener(listenerName);
      app.on(Event.name, Listener.dispatch);
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