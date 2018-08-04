/**
 * This module routes any URL path that starts with: '.../api/'
 */

'use strict';

// var debug = require('debug');
// var error = debug('apiRoutes:error');
// var log = debug('apiRoutes:log');

var express = require('express');
var router = express.Router();

var LoginController = require('../controllers/loginController');
var UserController = require('../controllers/userController');




router.route('/login').get(function (req, res) {
    if (req._parsedUrl.query == 'signout')
      res.clearCookie('username');
    res.render('admin/pages/login.ejs');
  })
  .post(function (req, res) {
    LoginController.verify_admin_login(req, res, function () {
      if (res.adminUser) {
        res.cookie('username', res.adminUser.id);
        return res.redirect("/admin/dashboard");
      }
      return res.redirect("/admin/login");
    });
  });


router.all('*', function (req, res, next) {
  //Don't block api!
  if (req.originalUrl.indexOf('/api') != -1)
    return next();

  var cookies = ServicesController.parseCookies(req)
  var username = cookies.username;
  if (username) {
    req.body.adminID = username;
    LoginController.verify_admin(req, res, function () {
      if (res.isAdmin) {
        if (req.originalUrl == '/admin/login')
          res.redirect(req.originalUrl);
        else
          next();
      } else {
        res.clearCookie('username');
        res.redirect('/admin/login');
      }
    });
  } else {
    if (req.originalUrl != '/admin/login')
      res.redirect('/admin/login')
    else
      next();
  }
});

//
// ─── LOGIN SECTION ──────────────────────────────────────────────────────────────
//
//
// ──────────────────────────────────────────────────────────── LOGIN SECTION ─────
//

//
// ─── DASHBOARD SECTION ──────────────────────────────────────────────────────────
//
router.get('/dashboard', function (req, res) {
  DashboardController.getData(req, res, function (err) {
    res.render('admin/pages/dashboard.ejs', {
      activeUsers: res.activeUsers,
      pendingUsers: res.pendingUsers,
    });
  });
});
//
// ──────────────────────────────────────────────────────── DASHBOARD SECTION ─────
//

//
// ─── USERS SECTION ──────────────────────────────────────────────────────────────
//
router.get('/users', function (req, res) {
  UserController.getUsers(req, res, function (err) {
    res.render('admin/pages/users.ejs', {
      activeUsers: res.activeUsers,
      pendingUsers: res.pendingUsers
    });
  });
});

router.route('/nextUsers')
  .post(function (req, res) {
    UserController.getNextUsers(req, res);
  });

router.route('/pendingUser')
  .post(function (req, res) {
    UserController.aproveUser(req, res);
  })
  .delete(function (req, res) {
    UserController.disaproveUser(req, res);
  });

router.get('/userProfile', function (req, res) {
  UserController.getProfile(req, res, function (err) {
    res.render('admin/pages/userProfile.ejs', {
      user: res.user,
    });
  });
});

//
// ──────────────────────────────────────────────────────────── USERS SECTION ─────
//


//
// ─── SET DEFAULTS IN DB ─────────────────────────────────────────────────────────
//
//  router.route('/makeUser')
//   .post(function (req, res) {
//     LoginController.createSchema(req,res);
//   });
//
// ─────────────────────────────────────────────────────── SET DEFAULTS IN DB ─────
//

module.exports = router;
