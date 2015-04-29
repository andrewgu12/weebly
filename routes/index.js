(function() {
  var express, router;

  express = require('express');

  router = express.Router();

  router.get('/', function(req, res) {
    return res.render('index', {
      title: 'Weebly'
    });
  });

  module.exports = router;

}).call(this);
