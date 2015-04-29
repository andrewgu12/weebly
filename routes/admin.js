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
    res.redirect("/admin");
  };

  router.get('/', function(req, res) {
    return res.render('admin/admin_index.jade', {
      title: "Weebly Admin Editor"
    });
  });

  router.get('/editor', isLoggedIn, function(req, res) {
    var pages;
    pages = [""];
    return Pages.find({
      "id": req.user.google.token
    }, function(err, docs) {
      var i;
      if (!docs) {
        if (req.user.google.page) {
          pages = req.user.google.page;
          pages = pages.split(", ");
        }
      }
      docs = JSON.stringify(docs);
      docs = JSON.parse(docs);
      for (i in docs) {
        pages.push(docs[i].UserPages.title);
      }
      return res.render('admin/admin_editor.jade', {
        user: req.user,
        pages: pages
      });
    });
  });

  router.post('/editor', function(req, res) {
    var staticID, titleID;
    staticID = req.body.staticID;
    titleID = req.body.title;
    titleID = titleID.replace(/\s/g, '');
    return Pages.findOne({
      "id": req.user.google.token,
      "UserPages.pageID": staticID
    }, function(err, page) {
      var newPage;
      if (err) {
        return err;
      }
      if (page) {
        page.UserPages.title = req.body.title;
        page.UserPages.id = titleID;
        page.UserPages.content = req.body.pageContent;
        page.save(function(err) {
          if (err) {
            throw err;
          }
          return page;
        });
      } else {
        newPage = new Pages();
        newPage.id = req.user.google.token;
        newPage.UserPages.title = req.body.title;
        newPage.UserPages.pageID = Math.floor((Math.random() * 10000) + 1);
        newPage.UserPages.id = titleID;
        newPage.UserPages.content = req.body.pageContent;
        console.log(newPage);
        newPage.save(function(err) {
          if (err) {
            throw err;
          }
          return newPage;
        });
      }
      return res.redirect('/admin/editor/');
    });
  });

  router.get('/editor/:pageID', isLoggedIn, function(req, res) {
    var pages, staticID, urlID;
    urlID = req.param("pageID");
    staticID = req.body.staticID;
    pages = ["undefined"];
    Pages.find({
      "id": req.user.google.token
    }, function(err, docs) {
      var i;
      if (!docs) {
        pages = req.user.google.page;
        pages = pages.split(", ");
      }
      docs = JSON.stringify(docs);
      docs = JSON.parse(docs);
      for (i in docs) {
        pages.push(docs[i].UserPages.title);
      }
      return console.log(pages);
    });
    return Pages.findOne({
      "id": req.user.google.token,
      "UserPages.id": urlID
    }, function(err, page) {
      var newPage, pageContent, pageTitle;
      if (page) {
        pageContent = page.UserPages.content;
        console.log(pageContent);
        pageTitle = page.UserPages.title;
        staticID = page.UserPages.pageID;
      } else {
        newPage = new Pages();
        newPage.id = req.user.google.token;
        newPage.UserPages.title = urlID;
        newPage.UserPages.id = urlID;
        newPage.UserPages.pageID = Math.floor((Math.random() * 10000) + 1);
        newPage.UserPages.content = " ";
        pageTitle = urlID;
        pageContent = " ";
        if (urlID !== "Home") {
          console.log("It goes here");
          newPage.save(function(err) {
            if (err) {
              throw err;
            }
            return newPage;
          });
        }
      }
      return res.render('admin/admin_filledEditor.jade', {
        pageTitle: pageTitle,
        pageContent: pageContent,
        pageID: urlID,
        staticID: staticID,
        user: req.user,
        pages: pages
      });
    });
  });

  router.get('/api/pages', isLoggedIn, function(req, res) {
    return Pages.find({
      "id": req.user.google.token
    }, function(err, docs) {
      if (err) {
        throw err;
      }
      return res.send(JSON.stringify(docs));
    });
  });

  router.get('/api/pages/:id', isLoggedIn, function(req, res) {
    var urlID;
    urlID = req.param("id");
    return Pages.findOne({
      "UserPages.pageID": urlID
    }, function(err, page) {
      if (err) {
        throw err;
      }
      return res.send(JSON.stringify(page));
    });
  });

  router.post('/api/pages', isLoggedIn, function(req, res) {
    var newPage;
    newPage = new Pages();
    newPage.id = req.user.google.token;
    newPage.UserPages.title = req.body.title;
    newPage.UserPages.pageID = Math.floor((Math.random() * 10000) + 1);
    newPage.UserPages.content = req.body.content;
    return newPage.save(function(err) {
      if (err) {
        throw err;
      }
      return res.send(JSON.stringify(newPage));
    });
  });

  router.put('/api/pages/:id', isLoggedIn, function(req, res) {
    var urlID;
    urlID = req.param("id");
    return Pages.findOne({
      "UserPages.pageID": urlID
    }, function(err, page) {
      if (err) {
        throw err;
      }
      page.id = req.user.google.token;
      page.UserPages.title = req.body.title;
      page.UserPages.content = req.body.content;
      return page.save(function(err) {
        if (err) {
          throw err;
        }
        return res.send(JSON.stringify(page));
      });
    });
  });

  router["delete"]('/api/pages/:id', isLoggedIn, function(req, res) {
    var urlID;
    urlID = req.param("id");
    return Pages.findOne({
      "UserPages.pageID": urlID
    }, function(err, page) {
      if (err) {
        throw err;
      }
      return page.remove(function(err) {
        if (err) {
          throw err;
        } else {
          return res.redirect('/pages');
        }
      });
    });
  });

  router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/admin/editor',
    failureRedirect: '/admin'
  }));

  module.exports = router;

}).call(this);
