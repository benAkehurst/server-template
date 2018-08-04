'use strict';
var async = require('async');

var UserModel = require('../../db/models/general/userModel');
var mailHandler = require('../../api/v1/handlers/mailHandler');

function getUsers(req, res, cb){

    async.parallel({
        activeUsers: function (callback) {
            UserModel.find({
                status: 'active'
            },{
                _id:1,
                email:1,
                name: 1,
                telephoneNumber: 1,
                businessName: 1,
                businessField: 1,
                businessRole:1,
                businessAddress: 1,
                businessEmployees: 1

            }).exec(function (err, activeUsers) {
                callback(err, activeUsers);
            });
        },
        pendingUsers: function (callback) {
            UserModel.find({
                status: 'pending'
            },{
                _id:1,
                email:1,
                name: 1,
                telephoneNumber: 1,
                businessName: 1,
                businessField: 1,
                businessRole:1,
                businessAddress: 1,
                createdAt: -1,

            })
            .exec(function (err, pendingUsers) {
                callback(err, pendingUsers);
            });
        },
    }, function (err, results) {
        if (err) {
            res.activeUsers = [];
            res.pendingUsers = [];  
            
        }else{
            const {
                pendingUsers,
                activeUsers,
            } = results;
            res.pendingUsers = pendingUsers;
            res.activeUsers = activeUsers;
        }
        cb();
    });
}

function aproveUser(req,res){
    let userId = req.query.userId;
    let userEmail = req.body.email;
    UserModel.findByIdAndUpdate(userId, {
        status: 'active'
    })
    .exec(function (err, ruleObj) {
        if (err) {
            res.json({
                success: false
            });
            return;
        }
        // Send email function goes here
        mailHandler.sendApprovedByAdminEmail(userEmail);
        res.send({
            success: true
        });
        return;
    });
}
function disaproveUser(req,res){
    let userId = req.query.userId;
    UserModel.findByIdAndUpdate(userId, {
        status: 'deleted'
    })
    .exec(function (err, ruleObj) {
        if (err) {
            res.json({
                success: false
            });
            return;
        }
        res.send({
            success: true
        });
        return;
    });
}







function getNextUsers(req, res, cb) {
    var length = Number(req.body.length);
    var start = Number(req.body.start);
    async.parallel({
        activeUsers: function (callback) {
            getUserForTable(start,length,callback);
        },
        activeCount:function(callback){
            userCount(callback);
        },
    },function(err, results){
        if (err) {
            res.status(500).send(err);
         } else {
             var resObj = {
                 draw: req.body.draw,
                 recordsTotal: results.activeCount,
                 recordsFiltered: results.activeCount,
                 data: results.activeUsers
             };
             res.json(resObj);
         }
    });
}


function userCount(cb) {
    UserModel.count({status:'active'}).exec(function (err, count) {
        cb(err, count);
    });
}

function getUserForTable(skip, limit, cb) {
    UserModel
    .aggregate()
    .match({status: 'active'})
    .project({
        _id: 1,
        name: 1,
        businessName: 1,
        businessField: 1,
        businessRole :1,
        numQuestions : {$size : "$askedQuestions"},
        numComments :  {$size : "$commentedQuestions"},
    })
    .limit(limit)
    .skip(skip)
    .exec(function (err, activeUsers) {
        cb(err, activeUsers);
    });
}

function getProfile(req,res,cb){
    UserModel.findById(req.query.userId).exec((err, item) => {
        if(err){
            res.user = {}
        }else{
            res.user = item
        }
        cb();
    })
}

module.exports = {
    getUsers,
    getNextUsers,
    aproveUser,
    disaproveUser,
    getProfile

};