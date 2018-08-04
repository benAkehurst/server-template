"use strict";

var debug = require("debug");
var error = debug("reportModel:error");
var log = debug("reportModel:log");

var mongoose = require("mongoose");
require("mongoose-type-url"); // for url types


//
// ─── REF MODELS ─────────────────────────────────────────────────────────────────
//
var Schema = mongoose.Schema;

var UserModel = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: 'email is required'
    },
    password: {
        type: String,
        required: 'password is required'
    },
    name: {
        type: String,
        required: 'name is required'
    },
    image: {
        type: String
    },
    online: {
        type: Boolean, 
        default: false
    },
    status: {
        type: String,
        enum: [ 'active', 'deleted'],
        default: ['active']
    }
}, {
    timestamps: true
});


var uniqueValidator = require('mongoose-unique-validator');
    UserModel.plugin(uniqueValidator,  { message: 'קיים אימייל במערכת' });


UserModel.pre('find', function () {
    this.where({status: { $ne: 'deleted'}});
});

UserModel.set("toJSON", {
    transform: function(doc, ret, options) {
        delete ret.password;
        delete ret.status;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model("UserModel", UserModel);
