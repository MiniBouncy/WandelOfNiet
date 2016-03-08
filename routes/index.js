var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Example on how to use the wrapper:
  // This snippet outputs 'saved' to the
  // node console every time you save a
  // User model to the database (User.save())
  // User.schema.pre('save', function(next){
  //   console.log('saved');
  //   next();
  // });

  // Example on how to use the wrapper:
  // This snippet saves a user to the
  // users collection in the database
  // var user = new User();
  // user.username = 'testuser';
  // user.password = 'testpw';
  // user.display_name = 'Test User';
  // user.save();

  res.status(200);
  res.send({
    message: 'Hello'
  });
});

module.exports = router;
