const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

const controller = (filename)=>{
  const controllerClass = require(path.join(__dirname, `/controllers/${filename}`));
  return new controllerClass;
}

const model = (filename)=>{
  return require(path.join(__dirname, `/models/${filename}`));
}

const middleware = (key)=>{
  const nameAndParam = key.split(':');
  const Middlewares = require('./Middlewares');
  const middlewarePath = Middlewares[nameAndParam[0]];
  const middleware = require(middlewarePath);
  return middleware(nameAndParam[1]);
}

const setEnv = (envValues) => {
  const envConfig = dotenv.parse(fs.readFileSync('.env'));
  for (const [key, value] of Object.entries(envValues)) {
    envConfig[key] = value;
  }
  fs.writeFileSync('.env', Object.entries(envConfig).map(([k, v]) => `${k}=${v}`).join('\n'));
}

const randStr = (length) => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }
  return randomString;
}



module.exports = {
  controller,
  model,
  middleware,
  setEnv,
  randStr
}