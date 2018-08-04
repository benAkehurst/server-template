"use strict";

var mongoose = require("mongoose");
var generator = require('generate-password');


//
// ─── HANDLERS ───────────────────────────────────────────────────────────────────
//

var userHandler = require('../handlers/userHandler');
var mailHandler = require('../handlers/mailHandler');

//
// ─── GET ────────────────────────────────────────────────────────────────────────
//

/**
 * Returns the data of the user without populate
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getUserData(req, res, next) {
	const userId = req.params.userId;

	userHandler.getUserReduced(userId, (err, userR) => {
		if (err) {
			return next(err);
		}
		return res.send({
			success: true,
			user: userR
		});
	})
}

/**
 * Returns the data of the user with populate
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getAllUserData(req, res, next) {
	const userId = req.params.userId;

	userHandler.getUserExtended(userId, (err, user) => {
		if (err) {
			return next(err);
		}
		return res.send({
			success: true,
			user: user
		});
	})
}


//
// ────────────────────────────────────────────────────────────────────── GET ─────
//

//
// ─── POST ───────────────────────────────────────────────────────────────────────
//

/**
 * Register a new User
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function registerUser(req, res, next) {

	const userData = req.body.data;

	userHandler.registerUser(userData, (err, user) => {
		if (err) {
			return next(err);
		}
		res.send({
			success: true
		});
	})
}

/**
 * Try to login and if exist the data then Returns the user without populate
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function login(req, res, next) {
	const email = req.body.data.email;
	const password = req.body.data.password;

	if (!email || !password) {
		return next(Error("חלק מהשדות חסרים"));
	}

	userHandler.login(email, password, (err, user) => {
		if (err) {
			return next(Error(err))
		} else {
			let ret;
			if (user && user.status === "active") {
				ret = {
					success: true,
					user: user
				}
			} else if (user && user.status === "pending") {
				ret = {
					success: "pending"
				}
			} else {
				ret = {
					success: "nouser"
				}
			}
			res.send(ret);
		}
	})
}

/**
 * Update a current user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function updateUserData(req, res, next) {
	var updatedUser = req.body.data;

	userHandler.updateUserData(updatedUser, (err, user) => {
		if (err) {
			return next(err);
		}
		return res.send({
			success: true,
			user: user
		});
	})
}

/**
 * Changes a user password
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function changePassword(req, res, next) {
	const userId = req.params.userId;
	const changePassObj = req.body.data;

	if (changePassObj.newPassword != changePassObj.repeatedPassword) {
		cb(Error("הסיסמאות אינן זהות"));
	}

	userHandler.changePassword(userId, changePassObj, (err, user) => {
		if (err) {
			return next(err);
		}
		return res.send({
			success: true,
			user: user
		});
	});
}

/**
 * Changes a user password from login if user doesn't have user id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function forgotPassword(req, res, next) {
	let email = req.body.data;
	let newPassword = generator.generate({
		length: 10,
		numbers: true
	});

	userHandler.forgotPassword(email, newPassword, (err, newData) => {
		if (err) {
			next(err);
		} else {
			mailHandler.sendNewPassword(email, newPassword, (err, body) => {
				if (err) {
					next(err)
				} else {
					return res.send({
						success: true
					});
				}
			})
		}
	});
}

/**
 * SENDS AN INVITE TO ANY PERSON A USER WANTS TO INVITE TO THE SYSTEM
 * @param {*} req
 * @param {*} res
 */
// TODO: CHANGE MAILGUN DETAILS TO REAL ELEMENTS
// TODO: CHANGE INVITE MAIL BODY
function sendInviteEmailToFriend(req, res) {
	var fromName = req.body.data.fromUserName;
	var fromEmail = req.body.data.fromEmail;
	var toEmail = req.body.data.toEmail;

	mailHandler.sendInviteEmailToFriend(fromName, fromEmail, toEmail, (err, resp) => {
		if (err) {
			console.log(err);
			res.send({
				success: false,
				error: err
			});
		}
		res.send({
			success: true,
			body: resp
		});
	});
}


function userSixMonthCheck(req, res) {
	var userId = req.body.userId;
	var userEmail = req.body.userEmail;
	if (userId) {
		userHandler.resetUserStatusAfterSixMonths(userId, (err, response) => {
			if (err) {
				console.log(err);
				res.send({
					success: false,
					error: err,
					msg: 'user change status failed'
				});
			}
			res.send({
				success: true,
				body: response,
				msg: 'user change status complete'
			});
		})
	}
	if (userEmail) {
		mailHandler.sendEmailAfter6Months(userEmail, (err, response) => {
			if (err) {
				console.log(err);
				res.send({
					success: false,
					error: err,
					msg: 'user email not sent'
				});
			}
			res.send({
				success: true,
				body: response,
				msg: 'user emailed about status change'
			});
		});
	}
}


function get_notification(req, res, next) {
	const userId = req.params.userId;
	questionHandler.getUserQuestionsIds(userId, (err, questionsIds) => {
		if (err) {
			return next(err);
		} else if (questionsIds.length === 0) {
			const emptyComment = [];
			res.json(emptyComment);
		} else {
			commentHandler.last24HComments(questionsIds, userId, (err, comments, next) => {
				if (err) {
					return next(err);
				} else {
					const commentArray = [];
					comments.forEach(comment => {
						commentArray.push({
							questionId: comment.question._id,
							questionTitle: comment.question.title,
							createdAt: comment.createdAt,
							replierName: comment.user.name,
							replierImage: comment.user.image
						});
					});
					res.json(commentArray);
				}
			})
		}
	})
}

function checkAllOnlineUsers(req, res, next) {
	userHandler.getAllOnlineUsers((err, users) => {
		if (err) {
			return next(err);
		}
		return res.send({
			success: true,
			data: users
		});
	});
}

function userOnline(req, res) {
	var user = req.body.data;
	userHandler.changeUserOnlineStatus(user._id, true, (err, user) => {
		if (err) {
			return next(err);
		}
		return res.send({
			success: true,
			msg: 'user online'
		});
	})
}

function userOffline(req, res) {
	var user = req.body.data;
	userHandler.changeUserOnlineStatus(user._id, false, (err, user) => {
		if (err) {
			return next(err);
		}
		return res.send({
			success: true,
			msg: 'user offline'
		});
	})
}

function readNotification(req, res, next) {
	var data = req.body.data;
	userHandler.readNotification(data._id, (err, user) => {
		if (err) {
			return next(err);
		}
		return res.send({
			success: true,
			notificationShow: user.notificationShow
		});
	})
}

module.exports = {
	registerUser,
	login,
	getUserData,
	updateUserData,
	getAllUserData,
	changePassword,
	forgotPassword,
	sendInviteEmailToFriend,
	get_notification,
	checkAllOnlineUsers,
	userOnline,
	userOffline,
	readNotification,
	userSixMonthCheck
};

//
// ───────────────────────────────────────────────────────────────────── POST ─────
//
