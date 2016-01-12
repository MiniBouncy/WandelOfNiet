var express = require('express');
var router = express.Router();
var User = require('../db/models/user');

router.route('/')

// Returns currently logged in user (self)
.get(function(req, res, next){
  res.status(200);
  res.send({
    success: true,
    user: req.currentUser
  });
});

router.route('/password')

.post(function(req, res, next){
  if(req.body.old_password == req.currentUser.password){
    req.currentUser.password = req.body.new_password;

    req.currentUser.save();

    res.status(200);
    res.send({
      success: true,
      message: 'User password changed successfully'
    });
  } else {
    res.status(400);
    res.send({
      success: false,
      message: 'Old password is incorrect'
    });
  }
});

// single user actions
router.route('/:user_id')

// finds a single user by user_id
.get(function(req, res, next) {
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

// updates a user
.put(function(req, res, next) {
  req.currentUser.location = req.body.location;

  req.currentUser.save();

  res.status(200);
  res.send({
    success: true,
    message: 'User info updated successfully',
    user: req.currentUser
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

        // retrieve all documents that have this users' id in their friends lists
        User.find({ friends: user._id }, function(err, friends) {
          if (err) {
            res.json({ warning: 'References not removed' });
          } else {

            // pull each reference to the deleted user one-by-one
            friends.forEach(function(friend){
              friend.friends.pull(user._id);
              friend.save(function(err) {
                if (err) {
                  res.json({ warning: 'Not all references removed' });
                }
              });
            });
          }
        });

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
});

// All friend related requests
router.route('/friends/:username')

// Returns all friends of the given user
.get(function(req, res, next) {

  // retrieve
  User.findOne({ 'username': req.params.username.toLowerCase() }, function(err, user) {
    if (err) {
      res.status(500);
      res.send({
        success: false,
        message: 'Something went wrong'
      });
    } else {
      if (user) {
        User.find({
          _id: { $in: user.friends }
        }, function(err, friends){
          if(err){
            res.status(500);
            res.send({
              success: false,
              message: 'Something went wrong'
            });
          } else {
            if(friends){
              var friendsTemp = [];
              for(var i = 0; i < friends.length; i++){
                friendsTemp.push({
                  _id: friends[i]._id,
                  username: friends[i].username
                });
              }

              res.status(200);
              res.send({
                success: true,
                friends: friendsTemp
              });
            }
          }
        });
      } else {
        res.status(400);
        res.send({
          success: false,
          message: 'User does not exist'
        });
      }
    }
  });
})

// Make friends with another user
// Either user will have each other's user_id in their respective friends list
.post(function(req, res, next) {
  // Check whether the user want to add himself
  if (req.params.username.toLowerCase() == req.currentUser.username.toLowerCase()) {
    res.status(403);
    res.send({
      success: false,
      message: 'Cannot add yourself as friend'
    });
  } else {
    User.findOne({ 'username': req.params.username.toLowerCase() }, function(err, user){
      if(err){
        res.status(500);
        res.send({
          success: false,
          message: 'Something went wrong'
        });
      } else {
        if(user){
          if(req.currentUser.friends.indexOf(user._id) == -1){
            req.currentUser.friends.push(user._id);
            user.friends.push(req.currentUser._id);

            user.save();
            req.currentUser.save(function(err, user){
              if(err){
                res.status(500);
                res.send({
                  success: false,
                  message: 'Something went wrong'
                });
              } else {
                User.find({
                  _id: { $in: user.friends }
                }, function(err, friends){
                  if(err){
                    res.status(500);
                    res.send({
                      success: false,
                      message: 'Something went wrong'
                    });
                  } else {
                    if(friends){
                      res.status(200);
                      res.send({
                        success: true,
                        message: 'Added friend successfully',
                        friends: friends
                      });
                    }
                  }
                });
              }
            });
          } else {
            res.status(403);
            res.send({
              success: false,
              message: 'You are already friends with that user'
            });
          }
        } else {
          res.status(403);
          res.send({
            success: false,
            message: 'The user you are trying to add as friend does not exist'
          });
        }
      }
    });
  }
})

// Removes the given user from either user's friend list
.delete(function(req, res) {
  if(req.params.username.toLowerCase() == req.currentUser.username.toLowerCase()){
    res.status(403);
    res.send({
      success: false,
      message: 'Cannot remove yourself as friend'
    });
  } else {
    User.findOne({ 'username': req.params.username.toLowerCase() }, function(err, user){
      if(err){
        res.status(500);
        res.send({
          success: false,
          message: 'Something went wrong'
        });
      } else {
        if(user){
          if(req.currentUser.friends.indexOf(user._id) == -1){
            res.status(403);
            res.send({
              success: false,
              message: 'You are not friends with that user'
            });
          } else {
            req.currentUser.friends.splice(user._id, 1);
            user.friends.splice(req.currentUser._id, 1);

            req.currentUser.save();
            user.save(function(err, user){
              if(err){
                res.status(500);
                res.send({
                  success: false,
                  message: 'Something went wrong'
                });
              } else {
                User.find({
                  _id: { $in: user.friends }
                }, function(err, friends){
                  if(err){
                    res.status(500);
                    res.send({
                      success: false,
                      message: 'Something went wrong'
                    });
                  } else {
                    if(friends){
                      res.status(200);
                      res.send({
                        success: true,
                        message: 'Added friend successfully',
                        friends: friends
                      });
                    }
                  }
                });
              }
            });

            res.status(200);
            res.send({
              success: true,
              message: 'Removed friend successfully'
            });
          }
        } else {
          res.status(403);
          res.send({
            success: false,
            message: 'The friend you are trying to remove from your friends list does not exist'
          });
        }
      }
    });
  }
});

module.exports = router;
