'use strict';

var debug = require('debug');
var error = debug('generalRoutes:error');
var log = debug('generalRoutes:log');

var express = require('express');
var router = express.Router();

//
// ─── CONTROLLERS ────────────────────────────────────────────────────────────────
//

var userController = require('../../v1/controllers/userController');

//
// ─── USERS ──────────────────────────────────────────────────────────────────────
//

router.route('/signup')
  .post(userController.registerUser);

router.route('/login')
  .post(userController.login);

router.route('/:userId')
  .get(userController.getUserData)
  .post(userController.updateUserData);

router.route('/:userId/profile')
  .get(userController.getAllUserData);

//
// ───────────────────────────────────────────────────── USERS ─────
//

module.exports = router;
