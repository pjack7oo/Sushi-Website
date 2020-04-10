const express = require('express'),
      router  = express.Router(),
      AccountController = require('../controllers/account.js'),
      ApiResponse       = require('../models/api-response.js'),
      UserRegistration  = require('../models/user-registration.js');
      //user            //TODO  
      //mailer          //TODO or remove
var session = [],
    url = "http://localhost:42550";

router.route('./account/register')
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
        var accountController = new AccountController(User, req.session, mailer);

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