"use strict";

var mailgunSettings = require("../../../config/default.json");

var mailgun = require("mailgun-js")({
	apiKey: mailgunSettings.Mailgun.apiKey,
	domain: mailgunSettings.Mailgun.domain
});

function sendNewPassword(email, newPassword, cb) {
	var mail = {
		from: "no-replay@",
		to: email,
		subject: "",
		html: `<div style='direction:rtl; text-align:center;'>
            <img src='' />
            <h1 style='color:#ff6ecc' ></h1>
            <p style="font-size:16px; margin-bottom:30px;"></p>
           <a href=''> <button style='margin-bottom:20px; font-size:18px ;cursor:pointer; border-radius:15px; padding: 20px 40px; ; background-color:#ff6ecc; color:#fff;'></button></a>
          </div>`
	};

	mailgun.messages().send(mail, function (err, body) {
		cb(err, body)
	});
}

module.exports = {
	sendNewPassword
};

//
// ───────────────────────────────────────────────────────────────────── POST ─────
//
