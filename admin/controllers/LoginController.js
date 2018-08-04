'use strict';



/**
 * Created by nicom on 8/27/2017.
 */
var mongoose = require('mongoose');
var AdminUser = require('../models/adminUserModel');


exports.verify_admin = function (req, res, cb) {
    AdminUser.findById(req.body.adminID, function (err, result) {
        if (err)
            return cb(err);

        res.isAdmin = true;
        return cb();
    });
}

exports.verify_admin_login = function (req, res, cb) {
    AdminUser.find({ userID: req.body.user_name, userPass: req.body.password }, function (err, result) {
        if (err)
            return cb(err);
        if (result.length == 0) {
            return cb();
        }
        res.adminUser = result[0];
        return cb();
    });
}
// exports.createSchema = function (req, res, next) {
//     var newModel = new AdminUser({
//         userID: 'admin',
//         userPass: '123'
//     });
//     newModel.save(function (err, model) {
//         if (err)
//             next(err);
//         res.send({ success: true, id: model.id });
//     });
// };