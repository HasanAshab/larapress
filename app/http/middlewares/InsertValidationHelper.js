validator = (obj) => {
  console.log(obj)
}

module.exports = () => {
  return (req, res, next) => {
    req.validate = validator
    next();
  }
}