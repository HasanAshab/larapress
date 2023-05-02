const Middleware = require(base('illuminate/middlewares/Middleware'));

class CheckIfTheUserIsAdmin extends Middleware {
  handle(req, res, next){
    if(req.user.isAdmin){
      next();
    }
    return res.status(401).json({
      message: "Only admin can perform this action!"
    });
  }
}
module.exports = CheckIfTheUserIsAdmin;