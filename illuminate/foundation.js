const passErrorsToHandler = (fn) => {
  if (fn.length === 4) {
    return async function (err, req, res, next) {
      try {
        await fn(err, req, res, next);
      } catch (err) {
        next(err);
      }
    };
  } else if (fn.length === 3) {
    return async function (req, res, next) {
      try {
        await fn(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  }
  return async function (...args) {
    try {
      await fn(...args);
    } catch (err) {
      args[fn.length - 1](err);
    }
  };
};

module.exports = {
  passErrorsToHandler,
};
