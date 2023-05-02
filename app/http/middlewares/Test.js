const Middleware = require(base("illuminate/middlewares/Middleware"));

class Test extends Middleware {
  handle(req, res, next){
    console.log(this.options)
    //next();
  }
}

module.exports = Test;
