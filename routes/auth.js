const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { check, body } = require('express-validator/check');
const User = require('../models/user');

router.get('/login', authController.getLogin);

router.post(
  '/login',
  [
    body('email', 'Please enter a valid email').isEmail().normalizeEmail(),
    body('password', 'please enter a valid password with 4 character')
      .isLength({ min: 4 })
      .trim(),
  ],
  authController.postLogin
);

router.get('/signup', authController.getSignup);

router.post(
  '/signup',
  [
    body('email', 'Please enter a valid email')
      .isEmail()
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userData) => {
          if (userData) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      }),
    body('password', 'Please enter a valid password with 4 character ')
      .isLength({ min: 4 })
      .trim(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password doesn't match");
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
