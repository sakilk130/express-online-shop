const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');

const transpoter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key:
        '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',
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/login', {
    docTitle: 'Login',
    path: '/login',
    errorMessage: message,
    oldValues: {
      email: '',
      password: '',
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      docTitle: 'Login',
      path: '/login',
      errorMessage: errors.array()[0].msg,
      oldValues: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render('auth/login', {
          docTitle: 'Login',
          path: '/login',
          errorMessage: 'invalid email or password !',
          oldValues: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((isValid) => {
          if (isValid) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render('auth/login', {
            docTitle: 'Login',
            path: '/login',
            errorMessage: 'invalid email or password !',
            oldValues: {
              email: email,
              password: password,
            },
            validationErrors: [],
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(function (err) {
    console.log('Error:', err);
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    docTitle: 'Signup',
    path: '/signup',
    errorMessage: message,
    oldValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      docTitle: 'Signup',
      path: '/signup',
      errorMessage: errors.array()[0].msg,
      oldValues: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  return bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect('/login');
      return transpoter.sendMail({
        to: email,
        from: 'sakil.khan@papint.asia',
        subject: 'Signup Successful !',
        html: '<h1>You Successfully Signed up !</h1>',
      });
    })
    .catch((err) => console.log(err));
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/reset', {
    docTitle: 'Reset',
    path: '/reset',
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'User not found !');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpired = Date.now() + 300000;
        return user.save();
      })
      .then((result) => {
        res.redirect('/login');
        return transpoter.sendMail({
          to: req.body.email,
          from: 'sakil.khan@papint.asia',
          subject: 'Password Reset',
          html: `<p>Click this <a href="http://localhost:4000/reset/${token}">link</a> to set a new password</p>`,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpired: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Password reset date expried !');
        return res.redirect('/reset');
      }
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }

      res.render('auth/new-password', {
        docTitle: 'New Password',
        path: '/new-password',
        userId: user._id.toString(),
        resetToken: token,
        errorMessage: message,
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const userId = req.body.userId;
  const resetToken = req.body.resetToken;
  const password = req.body.password;

  let resetUser;
  User.findOne({
    _id: userId,
    resetToken: resetToken,
    resetTokenExpired: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res.redirect('/reset');
      }
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpired = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect('/login');
    })
    .catch((err) => console.log(err));
};
