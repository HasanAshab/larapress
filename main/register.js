// Register all route groups here
routes = {
  '/': '../routes/web',
  '/api': '../routes/api',
}

// Register all middlewares with a name
middlewares = {
  'auth': './app/http/middlewares/Authenticate',
  'verified': './app/http/middlewares/EnsureEmailIsVerified',
  'admin': './app/http/middlewares/CheckIfTheUserIsAdmin',
  'limit': './app/http/middlewares/LimitRequestRate',
  'error.log': './app/http/middlewares/LogErrorStack',
  'error.response': './app/http/middlewares/HandleClientError',
}

// Register all events with listener
events = {
  //
}

componentPaths = {
  'model': 'app/models',
  'trait': 'app/traits',
  'mail': 'app/mails',
  'event': 'app/events',
  'listener': 'app/listeners',
  'controller': 'app/http/controllers',
  'middleware': 'app/http/middlewares',
}

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

helpers = (global) => {
  const helpers = require('../helpers');
  Object.keys(helpers).forEach((name) => {
    global[name] = helpers[name];
  })
}

module.exports = {
  helpers,
  routes,
  middlewares,
  events,
  registerEvents,
  registerRoutes,
  componentPaths,
};