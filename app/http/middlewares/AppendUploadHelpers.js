module.exports = () => {
  return (req, res, next) => {
    req.file = (name) => {
      return req.files.filter((file) => {
        return file.fieldname === name;
      })[0];
    }
    next()
  }
}