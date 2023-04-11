const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { componentPaths } = require('./main/register');

url = (path) => {
  return `${process.env.APP_URL}${path}`;
}

storage = (storage_path) => {
  return path.join(__dirname, path.join('storage', storage_path));
}

public = (public_path) => {
  return path.join(storage('public'), public_path);
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

middleware = (keys) => {
  const Middlewares = require('./main/register').middlewares;
  if (typeof keys === 'object') {
    const middlewares = [];
    for (const key of keys) {
      const [name,
        param] = key.split(':');
      const middlewarePath = Middlewares[name];
      const middleware = require(middlewarePath);
      middlewares.push(middleware(param));
    }
    return middlewares;
  }
  const [name, param] = keys.split(':');
  const middlewarePath = Middlewares[name];
  const middleware = require(middlewarePath);
  return middleware(param);
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

randStr = (length) => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }
  return randomString;
}

const log = (data) => {
  const path = './storage/error.log';
  if(typeof data === 'object'){
    data = JSON.stringify(data);
  }
  fs.appendFile(path, `${data}\n\n\n`, (err) =>{
    if(err){
      console.error(err);
    }
  });
}

module.exports = {
  url,
  storage,
  controller,
  model,
  trait,
  middleware,
  util,
  setEnv,
  randStr,
  mail,
  log
}