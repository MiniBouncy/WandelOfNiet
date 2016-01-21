var express = require('express');
var router = express.Router();
var User = require('../db/models/user');

router.route('/')


.get(function(req, res, next) {
  User.find(function(err, users) {
    if (err) {
      res.status(500);
      res.send({
        success: false,
        message: 'Something went wrong'
      });
    } else {
      if(users){
        res.status(200);
        res.send({
          success: true,
          users: users
        });
      } else {
        res.status(500);
        res.send({
          success: false,
          message: 'Could not find users'
        });
      }
    }
  });
})

.post(function(req, res, next) {
  var user = new User();
  if(req.body.username){
     user.username = req.body.username;
  }

  if(req.body.password){
     user.password = req.body.password;
  }

  if(req.body.display_name){
     user.display_name = req.body.display_name;
  }
  if(req.body.e_mail){
         user.e_mail = req.body.e_mail;
  }

  user.save(function(err) {
    if (err) {
      res.status(500);
      res.send({
        success: false,
        message: 'Something went wrong'
      });
    } else {
      res.status(200);
      res.send({
        success: true,
        message: 'User created!'
      });
    }
  });
});

// single user actions
router.route('/:user_id')

// finds a single user by user_id
.get(function(req, res, next) {
  console.log('username:' +req.body.display_name);
  User.findById(req.params.user_id, function(err, user) {
    if (err) {
      res.status(500);
      res.send({
        success: false,
        message: 'Something went wrong'
      });
    } else {
      if(user){
        res.status(200);
        res.send({
          success: true,
          user: user
        });
      } else {
        res.status(500);
        res.send({
          success: false,
          message: 'User does not exist'
        });
      }
    }
  });
})

router.route('/login')

.post(function(req, res, next) {
  User.findOne({ username: req.body.username.toLowerCase() }, function(err, user) {
    if (err) {
      res.status(500);
      res.send({
        success: false,
        message: 'Something went wrong: ' + err
      });
    } else {
      if(user && user.password == req.body.password){
        res.status(200);
        res.send({
          success: true,
          user: user
        });
      } else {
        res.status(500);
        res.send({
          success: false,
          message: 'User does not exist'
        });
      }
    }
  });
})
.delete(function(req, res) {

  // retrieve the user
  User.findById(req.params.user_id, function(err, user) {
    if (err) {
      res.status(500);
      res.send(err);
    } else {
      if (user) {
        // remove the user
        user.remove();
        res.json({
          success: true,
          message: 'User successfully deleted'
        });
      } else {
        res.status(400);
        res.json({
          success: false,
          message: 'Could not find user.'
        });
        res.send();
      }
    }
  });
})

// updates a user
.put(function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    
    if(err) {
      res.status(500);
      res.send({
        success: false,
        message: 'Something went wrong ' + err
      });
    }  
      if(req.body.username){
         user.username = req.body.username;
      }

      if(req.body.password){
         user.password = req.body.password;
      }

      if(req.body.display_name){
         user.display_name = req.body.display_name;
      }
      if(req.body.e_mail){
         user.e_mail = req.body.e_mail;
      }
      user.save(function(err) {
      if (err) {
        res.status(500);
        res.send({
          success: false,
          message: 'Something went wrong'
        });
      } else {
        res.status(200);
        res.send({
          success: true,
          message: 'User updated'
        });
      }
    });
  });
})

module.exports = router;
