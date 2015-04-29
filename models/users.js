// The database model for each User
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema ({
	username: String,
	password: String,
	google:{
		id: String,
		token: String,
		email: String,
		name: String,
		page: String
	}
});

//userSchema.
module.exports = mongoose.model('User', userSchema);