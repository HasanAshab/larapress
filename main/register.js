// Register all global helpers
const helpers = (global) => {
  const helpers = require('../helpers');
  Object.keys(helpers).forEach((name) => {
    global[name] = helpers[name];
  })
}


// Register all route groups here
const routes = (app) => {
  app.use('/', require('../routes/web'));
  app.use('/api', require('../routes/api'));
}

// Register all middlewares with a name
const middlewares = {
  'auth': './app/http/middlewares/Authenticate',
  'guest': './app/http/middlewares/RedirectIfAuthenticated',
  'verified': './app/http/middlewares/EnsureEmailIsVerified',
  'error.log': './app/http/middlewares/LogErrorStack',
  'error.response': './app/http/middlewares/HandleClientError',
  'validation.helper': './app/http/middlewares/InsertValidationHelper',
  'validation.message': './app/http/middlewares/SendValidationMessage'
}

const componentPaths = {
  'model': 'app/models',
  'trait': 'app/traits',
  'mail': 'app/mails',
  'controller': 'app/http/controllers',
  'middleware': 'app/http/middlewares',
}

module.exports = {
  helpers,
  routes,
  middlewares,
  componentPaths,
};