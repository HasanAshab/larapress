module.exports = () => {
  return (req, res, next) => {
    try {
      if (req.user.emailVerified) {
        return next();
      }

      return (req.get('Content-Type') === 'application/json')
      ? res.status(401).json({
        success: false,
        message: 'Your have to verify your email to perfom this action!'
      }): res.redirect(req.header('Referer') || '/')
    }
    catch(err) {
      next(err)
    }
  }
}