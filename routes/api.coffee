# none of this is ever used.
express = require('express')
passport = require('passport')
require('../config/passport.js')(passport)
Pages = require('../models/pages.js')
router = express.Router()

isLoggedIn = (req, res, next) ->
	return next() if req.isAuthenticated()
	res.redirect "/api"
	return

router.get '/', (req, res) ->
	res.render 'api/index.jade', {title: "API Authentication | Weebly Trial Project"}

router.post '/', passport.authenticate("local-signup",
	successRedirect: '/api/pages'
	failureRedirect: '/api'
	failureFlash: true
)

# router.post '/', 
router.get '/pages', isLoggedIn, (req, res) ->
	Pages.find "id": req.user.google.token, (err, docs) ->
		console.log JSON.stringify docs
	res.render 'api/pages.jade'




# router.get '/auth/google', passport.authenticate('google', {scope:['profile', 'email']})

# router.get '/auth/google/callback', passport.authenticate('google', {successRedirect: '/api/pages', failureRedirect: '/api'})

module.exports = router