const isLogin = async function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    console.log(req.session);
    res.redirect("/");
  }
};

const isLogout = async function (req, res, next) {
  if (req.session.user) {
    res.redirect("/");
  } else {
    next();
  }
};

const isAdminLogin = async function (req, res, next) {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};

const isAdminLogout = async function (req, res, next) {
  if (req.session.admin) {
    req.session.admin = null;
    res.redirect("/admin/login");
  }
};

module.exports = {
  isAdminLogin,
  isAdminLogout,
  isLogin,
  isLogout,
};
