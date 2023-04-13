module.exports = () => {
  return (req, res, next) => {
    if(req.user.isAdmin){
      next();
    }
    return res.status().json({
      success: false,
      message: "Only admin can access this!"
    });
  }
}