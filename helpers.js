const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const urls = require(path.join(__dirname, '/register/urls'));
const Middlewares = require(path.join(__dirname, '/register/middlewares'));

base = (base_path = '') => {
  return path.join(__dirname, base_path);
}

isClass = (target) => {
  return typeof target === 'function' && /^\s*class\s+/.test(target.toString());
}

capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

url = (url_path) => {
  const domain = process.env.APP_DOMAIN;
  const port = process.env.APP_PORT;
  const protocol = 'http';
  //const protocol = port === '443'? 'https' : 'http';
  return `${protocol}://${path.join(`${domain}:${port}`, url_path)}`;
}

clientUrl = (url_path) => {
  const domain = process.env.CLIENT_DOMAIN;
  const port = process.env.CLIENT_PORT;
  const protocol = 'http';
  //const protocol = port === '443'? 'https' : 'http';
  return `${protocol}://${path.join(`${domain}:${port}`, url_path)}`;
}

route = (name, data = null) => {
  let endpoint = urls[name];
  if(!endpoint){
    return null;
  }
  if(data){
    const regex = /:(\w+)/g;
    const params = endpoint.match(regex);
    for (const param of params){
      endpoint = endpoint.replace(param, data[param.slice(1)])
    }
  }
  return `${process.env.APP_URL}${endpoint}`;
}

storage = (storage_path) => {
  return path.join(__dirname, path.join('storage', storage_path));
}


controller = (fileName) => {
  const Controller = require(base(`app/http/controllers/${fileName}`));
  return new Controller();
}

middleware = (keys) => {
  getMiddleware = (middlewarePath, options) => {
    const MiddlewareClass = require(path.join(__dirname, middlewarePath));
    return new MiddlewareClass(options).handle;
  }
  if (Array.isArray(keys)) {
    const middlewares = [];
    for (const key of keys) {
      const [name, params] = key.split(':');
      const middlewarePaths = Middlewares[name];
      if(middlewarePaths instanceof Array){
        const funcBasedParams = typeof params !== 'undefined'
          ? params.split('|')
          : undefined;
        for (let i = 0; i < middlewarePaths.length; i++){
          const middleware = getMiddleware(middlewarePaths[i], funcBasedParams[i] && funcBasedParams[i].split(','));
          middlewares.push(middleware);
        }
      }
      else {
        const middleware = getMiddleware(middlewarePaths, params && params.split(','));
        middlewares.push(middleware);
      }
    }
    return middlewares;
  }
  const [name, params] = keys.split(':');
  const middlewarePaths = Middlewares[name];
  if(middlewarePaths instanceof Array){
    const middlewares = [];
    const funcBasedParams = typeof params !== 'undefined'
          ? params.split('|')
          : undefined;
    for (let i = 0; i < middlewarePaths.length; i++){
      const middleware = getMiddleware(middlewarePaths[i], funcBasedParams[i] && funcBasedParams[i].split(','));
      middlewares.push(middleware);
    }
    return middlewares;
  }
  return getMiddleware(middlewarePaths, params && params.split(','));
}

setEnv = (envValues) => {
  const envConfig = dotenv.parse(fs.readFileSync('.env'));
  for (const [key, value] of Object.entries(envValues)) {
    envConfig[key] = value;
  }
  fs.writeFileSync('.env', Object.entries(envConfig).map(([k, v]) => `${k}=${v}`).join('\n'));
}

log = (data) => {
  const path = './storage/error.log';
  if(typeof data === 'object'){
    data = JSON.stringify(data);
  }
  fs.appendFile(path, `${data}\n\n\n`, (err) =>{
    if(err){
      throw err;
    }
  });
}

module.exports = {
  isClass,
  url,
  storage,
  controller,
  middleware,
  setEnv,
  log,
}