var express = require('express');
var router = express.Router();
var User = require('../db/models/user');
var querystring = require('querystring');
var http = require('http');


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


// Updates a user
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

// Delete a user
.delete(function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (err) {
      res.status(500);
      res.send(err);
    } else {
      if (user) {
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

router.route('/:user_id/balance')

// Get user balance
.post(function(req, res, next) {
  User.findOne({ user_id: req.body.user_id }, function(err, user) {
    if(err) {
      res.status(500);
      res.send({
        success: false,
        message: 'Something went wrong: ' +err
      });
    } else {
      res.status(200);
      res.send({
        succes: true,
        message: 'User balance: ' +user.balance
      });

    }
  })
});

router.route('/transaction')

// TODO bank stuurt true terug als het aan die kant geslaagd is en dan kan de balance worden veranderd.
.post(function(req, res, next) {
  var salt = 'A58JFK9874LAK';
  var hash = null; //hash('sha256', 'wandelOfNiet' + salt);

  var postData = querystring.stringify({
    'sender' : 'NL16RABO0846653421',
    'receiver' : 'NL08RABO0784598758',
    'description' : 'bla',
    'amount' : 5,
    'hash' : hash
  });

  var options = {
    hostname: 'localhost',
    port: 80,
    path: '/bank/payment',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  var req = http.request(options, (res) => {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log('BODY: ' + chunk);
    });
    res.on('end', () => {
      console.log('No more data in response.')
    })
  });

  req.on('error', (e) => {
    console.log('problem with request: ' + e.message);
  });

  // write data to request body
  req.write(postData);
  req.end();

});

  // var sender = "NL16RABO0846653421";
  // var receiver = "NL08RABO0784598758";
  // var description = "bla";
  // var amount = 5;
  // var request = require('sync-request');
  // var response = request('POST', 'http://localhost/bank/payment?sender=' + sender + '&receiver=' + receiver + '&amount=' + amount + '&description=' + description);
  // var body = response.getBody().toString();
  // var obj = JSON.parse(body);  
  // console.log('id ' +obj['id']);

  // var payRes = request('PUT', 'http://localhost/bank/payment/' +obj['id']);
  // var payBody = payRes.getBody().toString();
  // console.log('put: ' +payBody);

  // var reqBalance = request('GET', 'http://localhost/bank/payment/' +obj['id']);
  // var bodyBalance = reqBalance.getBody().toString();
  // console.log('get: ' +bodyBalance['amount']);

  // if(req.body.balance){
  //        user.balance = req.bodyBalance['amount'];
  // }


  /*
  var sender = "NL16RABO0846653421";
  var receiver = "NL08RABO0784598758";
  var description = "bla";
  var amount = 5;
  var salt = 'A58JFK9874LAK';
  var hash = hash('sha256', 'wandelOfNiet' + salt);
  var request = require('sync-request');
  var response = request('POST', 'http://localhost/bank/payment?sender=' + sender + '&receiver=' + receiver + '&amount=' + amount + '&description=' + description);
  */

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



module.exports = router;
