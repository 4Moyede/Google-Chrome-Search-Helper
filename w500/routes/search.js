var express = require('express');
var sync = require('synchronize');
var passport = require('../auth/index.js');
var router = express.Router();
let { PythonShell } = require('python-shell');

PythonShell.run = sync(PythonShell.run);

/* GET search listing. */
router.get('/', passport.ensureAuthenticated, function(req, res, next) {

  var keyword = req.query.keyword;

  if(!keyword){
    res.render('search', { data: {}});
  }
  else{
    var options = {
      mode: 'json',
      pythonOptions: ['-u'],
      args: [keyword]
    }

    sync.fiber(function(){
      var results = sync.await(PythonShell.run("./public/python/test.py", options, sync.defer()));
      res.render('search', { data: results[0] });
    });
  }
});

module.exports = router;