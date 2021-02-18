module.exports = function (req, res, next) {
  res.locals.isAuth = req.session.isAuthentificated;
  res.locals.csurf = req.csrfToken();
  next();
};
