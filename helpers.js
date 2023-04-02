const controller = (filename)=>{
  const path = require('path');
  const controllerClass = require(path.join(__dirname, `/controllers/${filename}`));
  return new controllerClass;
}

module.exports = {
  controller
}