var express = require('express');
var router = express.Router();
var https = require('https');

router.route('/ajax')

.get(function(req, res, next) {  
  console.log('test');
})

router.route('/ajax/free')

.get(function(req, res, next) {  
  console.log('free');
})

module.exports = router;
