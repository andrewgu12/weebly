(function() {
  var Pages, express, isLoggedIn, passport, router;

  express = require('express');

  passport = require('passport');

  require('../config/passport.js')(passport);

  Pages = require('../models/pages.js');

  router = express.Router();

  isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/api");
  };

  router.get('/', function(req, res) {
    return res.render('api/index.jade', {
      title: "API Authentication | Weebly Trial Project"
    });
  });

  router.post('/', passport.authenticate("local-signup", {
    successRedirect: '/api/pages',
    failureRedirect: '/api',
    failureFlash: true
  }));

  router.get('/pages', isLoggedIn, function(req, res) {
    Pages.find({
      "id": req.user.google.token
    }, function(err, docs) {
      return console.log(JSON.stringify(docs));
    });
    return res.render('api/pages.jade');
  });

  module.exports = router;

}).call(this);
