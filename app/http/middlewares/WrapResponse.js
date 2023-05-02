const Middleware = require(base("illuminate/middlewares/Middleware"));

class WrapResponse extends Middleware {
  handle(req, res, next) {
    const originalJson = res.json;
    res.json = function (response) {
      const { data, message } = response;
      const success = res.statusCode >= 200 && res.statusCode < 300;
      const wrappedData = { success };
      /*
      if(typeof data !== 'undefined' && typeof message !== 'undefined'){
        wrappedData.data = data;
        wrappedData.message = message;
      }
      else {
        wrappedData.data = response;
      }
*/
      if (isObject(response)) {
        wrappedData.data = {};
        for (const [key, value] of Object.entries(response)) {
          if (["data", "message"].includes(key)) {
            wrappedData[key] = value;
          } else {
            wrappedData.data[key] = value;
          }
        }
      } else {
        wrappedData.data = response;
      }

      originalJson.call(res, wrappedData);
    };
    next();
  }
}

module.exports = WrapResponse;
