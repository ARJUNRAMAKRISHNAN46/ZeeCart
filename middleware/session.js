
const verifyUser = (req, res, next) => {
  if (req.session.logged) {
    next();
  } else {
    res.redirect("/login");
  }
};


const userExist  = (req, res, next) => {
  if (req.session.logged) {
    res.redirect("/");
  } else {
    next();
  }
};

module.exports = { 
    verifyUser ,
    userExist
};