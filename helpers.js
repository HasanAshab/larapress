const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const componentPaths = require(path.join(__dirname, '/register/componentPaths'));
const urls = require(path.join(__dirname, '/register/urls'));
const Middlewares = require(path.join(__dirname, '/register/middlewares'));


app = () => {
  return require(path.join(__dirname, `main/app`));
}

url = (path) => {
  return `${process.env.APP_URL}${path}`;
}

route = (name, data = null) => {
  let endpoint = urls[name];
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

base = (base_path = '') => {
  return path.join(__dirname, base_path);
}

controller = (filename)=> {
  return require(path.join(__dirname, `${componentPaths.controller}/${filename}`));
}

model = (filename)=> {
  return require(path.join(__dirname, `${componentPaths.model}/${filename}`));
}

trait = (filename)=> {
  return require(path.join(__dirname, `${componentPaths.trait}/${filename}`));
}

event = (filename)=> {
  return require(path.join(__dirname, `${componentPaths.event}/${filename}`));
}

listener = (filename)=> {
  return require(path.join(__dirname, `${componentPaths.listener}/${filename}`));
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

util = (filename) => {
  return require(path.join(__dirname, `utils/${filename}`));
}

mail = (filename) => {
  return require(path.join(__dirname, `${componentPaths.mail}/${filename}`));
}

setEnv = (envValues) => {
  const envConfig = dotenv.parse(fs.readFileSync('.env'));
  for (const [key, value] of Object.entries(envValues)) {
    envConfig[key] = value;
  }
  fs.writeFileSync('.env', Object.entries(envConfig).map(([k, v]) => `${k}=${v}`).join('\n'));
}

const log = (data) => {
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
  app,
  url,
  storage,
  controller,
  model,
  trait,
  event,
  listener,
  middleware,
  util,
  setEnv,
  mail,
  log,
}