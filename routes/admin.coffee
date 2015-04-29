# Routes file for the admin side
express = require('express')
# passport = require('../config/passport.js')
passport = require('passport')
require('../config/passport.js')(passport)
Pages = require('../models/pages.js')
router = express.Router()
# check if logged in -> if not, redirect to home page, else continue flow
isLoggedIn = (req, res, next) ->
  return next()  if req.isAuthenticated()
  res.redirect "/admin"
  return

#home page
router.get '/', (req, res) ->
	res.render 'admin/admin_index.jade', {title: "Weebly Admin Editor"}

# editor page with a blank page -> all the pages for the current user are loaded to the sidebar
router.get '/editor', isLoggedIn,  (req, res) ->

	pages = [""]
	Pages.find "id":req.user.google.token, (err, docs) ->
		if !docs
			# prevents the app from crashing if there's nothing in the DB
			if req.user.google.page
				pages = req.user.google.page
				pages = pages.split ", "
	
		docs = JSON.stringify docs
		docs = JSON.parse docs
		for i of docs
			pages.push docs[i].UserPages.title
		res.render 'admin/admin_editor.jade', {user: req.user, pages: pages}

# Send the new or edited page to the database
router.post '/editor', (req, res) ->
	staticID= req.body.staticID
	# console
	titleID =req.body.title
	titleID = titleID.replace /\s/g, ''

	Pages.findOne "id": req.user.google.token, "UserPages.pageID": staticID, (err, page) ->
		return err if err
		# Check if the page already exists -> if so, update the existing one in the db
		if page
			page.UserPages.title = req.body.title
			page.UserPages.id = titleID
			page.UserPages.content = req.body.pageContent
			page.save (err) ->
				throw err if err
				return page
		# Create a new page if the one didn't already exist
		else
			newPage  = new Pages()
			newPage.id = req.user.google.token
			newPage.UserPages.title = req.body.title
			newPage.UserPages.pageID = Math.floor((Math.random() * 10000) + 1);
			newPage.UserPages.id = titleID
			newPage.UserPages.content = req.body.pageContent
			console.log newPage
			newPage.save  (err) ->
				throw err if err
				return newPage
		res.redirect '/admin/editor/'

# retrieve an existing page
router.get '/editor/:pageID',isLoggedIn, (req, res) ->
	urlID = req.param "pageID"
	staticID = req.body.staticID
	pages = ["undefined"]
	Pages.find "id":req.user.google.token, (err, docs) ->
		# find all the pages by this user
		if !docs
			pages = req.user.google.page
			pages = pages.split ", "
		docs = JSON.stringify docs
		docs = JSON.parse docs
		for i of docs
			pages.push docs[i].UserPages.title
		console.log pages
	Pages.findOne  "id": req.user.google.token, "UserPages.id":urlID, (err, page) ->

		# if page exists return the existing page
		if page
			pageContent = page.UserPages.content
			console.log pageContent
			pageTitle = page.UserPages.title
			staticID = page.UserPages.pageID

		else
			newPage  = new Pages()
			newPage.id = req.user.google.token
			newPage.UserPages.title = urlID
			newPage.UserPages.id = urlID
			newPage.UserPages.pageID =  Math.floor((Math.random() * 10000) + 1);
			newPage.UserPages.content = " "
			pageTitle = urlID
			pageContent = " "
			if(urlID != "Home") 
				console.log "It goes here"
				newPage.save  (err) ->
					throw err if err
					return newPage


		res.render 'admin/admin_filledEditor.jade', {pageTitle: pageTitle, pageContent: pageContent, pageID: urlID, staticID: staticID, user: req.user, pages: pages} 

# API -> login to Google will authenticate API token

#find all pages that belong to the user with that API token
router.get '/api/pages', isLoggedIn, (req, res) ->
	Pages.find "id": req.user.google.token, (err, docs) -> 
		throw err if err
		res.send JSON.stringify docs 

#get one page that has the ID belonging to the user and the title matching the URL id
router.get '/api/pages/:id', isLoggedIn, (req, res) ->
	urlID = req.param "id"
	Pages.findOne "UserPages.pageID": urlID, (err, page) -> 
		throw err if err
		res.send JSON.stringify page
		
#create a new page and save it to the DB
router.post '/api/pages', isLoggedIn, (req, res) -> 
	newPage = new Pages()
	newPage.id = req.user.google.token
	# console.log req.user.google.token
	newPage.UserPages.title = req.body.title
	newPage.UserPages.pageID = Math.floor((Math.random() * 10000) + 1) #randomly generate pageID
	newPage.UserPages.content = req.body.content
	newPage.save (err) ->
		# console.log newPage
		throw err if err
		res.send JSON.stringify newPage

# update an existing page in the DB
router.put '/api/pages/:id', isLoggedIn, (req, res) ->
	urlID = req.param "id"
	Pages.findOne "UserPages.pageID" : urlID, (err, page) ->
		throw err if err

		page.id = req.user.google.token
		page.UserPages.title = req.body.title
		page.UserPages.content = req.body.content
		page.save (err) ->
			throw err if err
			res.send JSON.stringify page

# delete a page from the DB belonging to the user and matching the pageID
router.delete '/api/pages/:id', isLoggedIn, (req, res) ->
	urlID = req.param "id"
	Pages.findOne "UserPages.pageID" : urlID, (err, page) ->
		throw err if err
		page.remove (err)->
			if err
				throw err
			else
				res.redirect '/pages'


router.get '/auth/google', passport.authenticate('google', {scope:['profile', 'email']})

router.get '/auth/google/callback', passport.authenticate('google', {successRedirect: '/admin/editor', failureRedirect: '/admin'})



module.exports = router