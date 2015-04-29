// The methods required for login and logout with Passport
//Will create a new user if none is found in database
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users.js');

var configAuth = require('./auth.js');

//var passport = require('passport');

module.exports = function(passport) {	
	// serialize user to session
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});
	// deserialize
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	// local signup not used
	passport.use('local-signup', new LocalStrategy( {
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {
			User.findOne({'username' : username, 'password': password}, function(err, user) {
				if(err) {
					console.log(err);
					return done(err);
				}
				return done(null, user);
			});
	}));
	passport.use(new GoogleStrategy({
		clientID		: configAuth.googleAuth.clientID,
		clientSecret	: configAuth.googleAuth.clientSecret,
		callbackURL		: configAuth.googleAuth.callbackURL,
	}, 
	function(token, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({ 'google.id' : profile.id}, function(err, user) {
				if(err)
					return done(err);

				if(user) {
					return done(null, user);
				} else {
					var newUser			= new User();
					newUser.google.id = profile.id;
					newUser.google.token = Math.floor((Math.random() * 1000000) + 1);
					newUser.username = newUser.google.token;
					newUser.google.name = profile.displayName;
					newUser.google.email = profile.emails[0].value;
					newUser.password = newUser.google.email;
					newUser.google.page = "Home";
					//newUser.api = Math.floor((Math.random() * 10000000) + 1);

					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));
};
