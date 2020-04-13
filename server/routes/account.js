const express = require('express'),
      router  = express.Router(),
      AccountController = require('../controllers/account.js'),
      ApiResponse       = require('../models/api-response.js'),
      UserRegistration  = require('../models/user-registration.js'),
      User              = require('../models/user.js'),
      UserSession       = require('../models/user-session.js'),
      UserLogon         = require('../models/user-logon.js');
      MailerMock        = require("../test/mailer-mock.js"),
      mailer = new MailerMock();      //TODO or remove
var session = [],
    url = "http://localhost:42550";

router.route('/account/register')
    .get(function(req, res) {
        res.send("hello");
    })
    .post(function(req, res) {
        
        
        var accountController = new AccountController(User, req.session, mailer);
        var userRegistration  = new UserRegistration(req.body);
        
        var apiResponse1 = accountController.getUserFromRegistration(userRegistration);

        res.set("Access-Control-Allow-Origin", url);

        if (apiResponse1.success) {
            
            
            accountController.register(apiResponse1.extras.user, function (err, apiResponse2) {
                
                return res.send(apiResponse2);
            });
        } else {
            res.send(apiResponse1);
        }
    });
    

router.route('/account/logon')
    .post(function (req, res) {
        var userSession   = new UserSession(),
        accountController = new AccountController(User, req.session, userSession, mailer);

        var userLogon = new userLogon(req.body);

        accountController.logon(userLogon.username, userLogon.password, function (err, response) {
            return res.send(response);
        });
    });

router.route('/account/logoff')
    .get(function (req, res) {
        var accountController = new AccountController(User, req.session, mailer);
        accountController.logoff();
        res.send(new ApiResponse({success: true}));
    })
    .post(function (req, res) {
        var accountController = new AccountController(User, req.session, mailer);
        accountController.logoff();
        res.send(new ApiResponse({ success: true }));
    });

// router.route('/account/resetpassword')
//     .post(function (req, res) {

//     })

module.exports = router;