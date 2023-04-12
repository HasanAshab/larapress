module.exports = () => {
  return (err, req, res, next) => {
    log(err.stack);
    next(err);
  }
}