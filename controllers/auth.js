const user = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    docTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  user
    .findById('60865f4a63b9470ab8c04256')
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(function (err) {
    console.log('Error:', err);
    res.redirect('/');
  });
};
