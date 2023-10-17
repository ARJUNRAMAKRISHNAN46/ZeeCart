function verifySignup(req, res, next) {
  if (req.session.logged) {
    next();
  } else {
    res.redirect("/home");
  }
}

module.exports = { verifySignup };
