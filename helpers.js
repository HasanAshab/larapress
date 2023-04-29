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
  //const CatchAllMethodErrors = require(base('illuminate/utils/CatchAllMethodErrors'));
  //CatchAllMethodErrors.wrapMethods(Controller);
  return new Controller();
}

middleware = (keys) => {
  if (keys instanceof Array) {
    const middlewares = [];
    for (const key of keys) {
      const [name, params] = key.split(':');
      const middlewarePaths = Middlewares[name];
      if(middlewarePaths instanceof Array){
        const funcBasedParams = typeof params !== 'undefined'
          ? params.split('|')
          : undefined;
        for (let i = 0; i < middlewarePaths.length; i++){
          const middleware = require(path.join(__dirname, middlewarePaths[i]));
          const pureMiddleware = funcBasedParams && typeof funcBasedParams[i] !== 'undefined'
            ? middleware(...funcBasedParams[i].split(','))
            : middleware();
          middlewares.push(pureMiddleware);
        }
      }
      else {
        const middleware = require(path.join(__dirname, middlewarePaths));
        const pureMiddleware = params
          ? middleware(...params.split(','))
          : middleware();
        middlewares.push(pureMiddleware);
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
      const middleware = require(path.join(__dirname, middlewarePaths[i]));
      const pureMiddleware = funcBasedParams && typeof funcBasedParams[i] !== 'undefined'
        ? middleware(...funcBasedParams[i].split(','))
        : middleware();
      middlewares.push(pureMiddleware);
    }
    return middlewares;
  }
  const middleware = require(path.join(__dirname, middlewarePaths));
  return params
    ? middleware(...params.split(','))
    : middleware();
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