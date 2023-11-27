const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');

const catchAsync = require('../utils/catchAsync');

router.route('/')
    .get(users.renderAccount)
    .post(catchAsync(users.updateAccount));

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/account/login' }), users.login);

router.get('/logout', users.logout);

module.exports = router;