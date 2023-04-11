module.exports = () => {
  const redirectTo = '/dashboard';
  return (req, res, next) => {
    if (auth(req, 'web').user()){
      return res.redirect(redirectTo);
    }
    next();
  }
}