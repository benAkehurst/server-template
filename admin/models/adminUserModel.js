'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userAdminSchema = new Schema({
  userID: String,
  userPass: String
});


exports.schema = userAdminSchema;
module.exports = mongoose.model('AdminUser', userAdminSchema); // adminUsers collection
