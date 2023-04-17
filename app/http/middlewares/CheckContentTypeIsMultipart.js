module.exports = () => {
  return (req, res, next) => {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.startsWith('multipart/form-data')) {
      return res.status(400).json({
        success: false,
        message: 'Only multipart/form-data requests are allowed'
      });
    }
    next();
  }
}