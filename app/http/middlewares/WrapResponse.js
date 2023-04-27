module.exports = (key = "data") => {
  return (req, res, next) => {
    const original = res.json;
    res.json = function (data) {
      const wrappedData = {};
      wrappedData[key] = data;
      original.call(this, wrappedData);
    };
    next();
  }
}
