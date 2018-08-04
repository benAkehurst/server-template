"use strict";
var async = require('async');
var mongoose = require("mongoose");
var UserModel = require("../../../db/models/general/userModel");
//
// ─── HANDLERS ───────────────────────────────────────────────────────────────────
//

var mailHandler = require('../handlers/mailHandler');

/**
 * Returns all the data from the registration
 * @param {*} userId 
 * @param {*} cb 
 */
function getUserReduced(userId, cb) {
  async.parallel({
    userData: (callback) => {
      UserModel.findById(userId).lean().exec(function (err, user) {
        callback(err, user);
      })
    }
  }, (err, results) => {
    if (err) {
      cb(err);
    }
    cb(results);
  })
}

/**
 * Returns all the data related to the user
 * @param {ObjectId} userId 
 * @param {*} cb 
 */
function getUserExtended(userId, cb) {
  async.parallel({
    userData: (callback) => {
      UserModel.findById(userId).lean().exec(function (err, user) {
        callback(err, user);
      })
    },

  }, (err, results) => {
    if (err) {
      cb(err);
    }
    cb(results);
  })
}



/**
 * Creates a new user
 * @param {UserModel} userData 
 * @param {*} cb 
 */
function registerUser(userData, cb) {
  var newUser = new UserModel({
    email: userData.email,
    password: userData.password,
    name: userData.name,
    image: userData.image
  });
  newUser.save(function (err, user) {
    cb(err, user);
  });
}

/**
 * Try to login, if success returns user
 * @param {string} email 
 * @param {string} password 
 * @param {*} cb 
 */
function login(email, password, cb) {
  UserModel.findOne({
      status: {
        $ne: "deleted"
      },
      email: email,
      password: password
    },
    (err, user) => {
      if (err) {
        cb(err);
      } else if (!user) {
        cb(Error("הסיסמא או כתובת המייל שגויים"));
      } else {
        if (user.status === "active") {
          cb(err, user);
        } else {
          cb();
        }
      }
    }
  );
}

/**
 * Updates current user
 * @param {UserModel} user 
 * @param {*} cb 
 */
function updateUserData(user, cb) {
  const currUser = removePropertiesOfUser(user);
  UserModel.findByIdAndUpdate(
      currUser._id,
      currUser, {
        new: false,
        strict: false
      })
    .lean()
    .exec(
      function (err, userData) {
        cb(err, userData);
      }
    );
}

/**
 * 
 * @param {ObjectId} userId 
 * @param {Object{oldPassword, newPassword, repeatedPassword}} changePassObj 
 * @param {*} cb 
 */
function changePassword(userId, changePassObj, cb) {

  UserModel.findOne({
      _id: userId,
      password: changePassObj.oldPassword
    },
    function (err, user) {
      if (err) {
        cb(err);
      } else if (!user) {
        return cb(Error("איימיל או סיסמא לא תואמים"));
      } else {
        UserModel.findByIdAndUpdate(
            userId, {
              password: changePassObj.newPassword
            }, {
              new: true
            })
          .exec((err, userData) => {
            cb(err, userData);
          });
      }
    }
  );
}



/**
 * Changes a user password from login if user doesn't have user id
 * @param {string} email 
 * @param {string} newPass 
 * @param {*} cb 
 */
function forgotPassword(email, newPass, cb) {
  UserModel.findOneAndUpdate({
      email: email
    }, {
      password: newPass
    })
    .exec((err, user) => {
      if (err) {
        cb(err);
      } else if (!user || user.nModified === 0) {
        cb(Error("האימייל לא קיים במערכת "));
      } else {
        cb(err, {
          email,
          newPass
        })
      }
    })
}

module.exports = {
  registerUser,
  login,
  updateUserData,
  changePassword,
  forgotPassword,
  getUserExtended,
  getUserReduced
};
