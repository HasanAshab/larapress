const path = require("path");
const fs = require("fs");

const passErrorsToHandler = (fn) => {
  if (fn.length === 4) {
    return async function (err, req, res, next) {
      try {
        await fn(err, req, res, next);
      } catch (err) {
        next(err);
      }
    };
  }
  return async function (req, res, next) {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
  /*  
  return async function (...args) {
    try {
      await fn(...args);
    } catch (err) {
      args[fn.length - 1](err);
    }
  };
  */
};

const generateEndpointsFromDirTree = (rootPath, cb) => {
  const stack = [rootPath];

  while (stack.length > 0) {
    const currentPath = stack.pop();
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      const status = fs.statSync(itemPath);

      if (status.isFile()) {
        const itemPathEndpoint = itemPath
          .replace(rootPath, "")
          .split(".")[0]
          .toLowerCase();
        cb(itemPathEndpoint, itemPath);
      } else if (status.isDirectory()) {
        stack.push(itemPath);
      }
    }
  }
}

module.exports = {
  passErrorsToHandler,
  generateEndpointsFromDirTree,
  
};
