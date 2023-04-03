const controller = (filename)=>{
  const path = require('path');
  const controllerClass = require(path.join(__dirname, `/controllers/${filename}`));
  return new controllerClass;
}

const model = (filename)=>{
  const path = require('path');
  return require(path.join(__dirname, `/models/${filename}`));
}

module.exports = {
  controller,
  model
}