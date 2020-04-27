const express = require("express"),
  router = express.Router(),
  AccountController = require("../controllers/account.js"),
  ApiResponse = require("../models/api-response.js"),
  UserRegistration = require("../models/user-registration.js"),
  User = require("../models/user.js"),
  UserSession = require("../models/user-session.js"),
  UserSendSave = require("../models/user-sendSave.js"),
  UserLogon = require("../models/user-logon.js"),
  MailerMock = require("../test/mailer-mock.js"),
  UserGetSave = require("../models/user-getSave.js"),
  UserPasswordReset = require("../models/user-passwordReset.js"),
  UserClearSave = require("../models/user-clearSave.js");
mailer = new MailerMock(); //TODO or remove
var session = [],
  url = "http://sushicat-meow.herokuapp.com/";

router
  .route("/account/register")
  .get(function (req, res) {
    res.send("hello");
  })
  .post(function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var userSession = new UserSession(),
      accountController = new AccountController(
        User,
        req.session,
        userSession,
        mailer
      );
    var userRegistration = new UserRegistration(req.body);

    var apiResponse1 = accountController.getUserFromRegistration(
      userRegistration
    );

    res.set("Access-Control-Allow-Origin", '*');

    if (apiResponse1.success) {
      accountController.register(apiResponse1.extras.user, function (
        err,
        apiResponse2
      ) {
        return res.send(apiResponse2);
      });
    } else {
      res.send(apiResponse1);
    }
  });

router.route("/account/login").post(function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  var userSession = new UserSession(),
    accountController = new AccountController(
      User,
      req.session,
      userSession,
      mailer
    );

  var userLogon = new UserLogon(req.body);

  accountController.logon(userLogon.username, userLogon.password, function (
    err,
    response
  ) {
    return res.send(response);
  });
});

router.route("/account/save").post(function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  var userSession = new UserSession(),
    accountController = new AccountController(
      User,
      req.session,
      userSession,
      mailer
    );

  var userSendSave = new UserSendSave(req.body);
  //console.log(userSendSave.gameData);

  accountController.saveData(
    userSendSave.username,
    userSendSave.gameData,
    userSendSave.date,
    userSendSave.userMoney,
    function (err, response) {
      return res.send(response);
    }
  );
});

router.route("/account/rolls").get(function (req, res) {
  var userSession = new UserSession(),
    accountController = new AccountController(
      User,
      req.session,
      userSession,
      mailer
    );

  accountController.getRolls(function (err, response) {
    if (err) {
      console.log(err);
    }
    return res.send(response);
  });
});

router.route("/account/data")
  .post(function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    var userSession = new UserSession(),
      accountController = new AccountController(
        User,
        req.session,
        userSession,
        mailer
      );
    var userGetSave = new UserGetSave(req.body);
    console.log(userGetSave);
    accountController.getData(userGetSave.username, function (err, response) {
      return res.send(response);
    });
  })
  .get(function (req, res) {
    var userSession = new UserSession(),
      accountController = new AccountController(
        User,
        req.session,
        userSession,
        mailer
      );
    console.log(req.get("username"));
    var userGetSave = new UserGetSave(req.body);
    console.log(userGetSave);

    accountController.getData(userGetSave.username, function (err, response) {
      if (err) {
        console.log(err);
      }
      return res.send(response);
    });
  });

router.route("/account/logoff")
  .get(function (req, res) {
    var userSession = new UserSession(),
      accountController = new AccountController(
        User,
        req.session,
        userSession,
        mailer
      );
    accountController.logoff();
    res.send(new ApiResponse({ success: true }));
  })
  .post(function (req, res) {
    var userSession = new UserSession(),
      accountController = new AccountController(
        User,
        req.session,
        userSession,
        mailer
      );
    accountController.logoff();
    res.send(new ApiResponse({ success: true }));
  });


  router.route("/account/delete")
    .post(function( req, res) {
      res.header("Access-Control-Allow-Origin", "*");
      
      var userSession = new UserSession(),
      accountController = new AccountController(
        User,
        req.session,
        userSession,
        mailer
      );
      var userGetSave = new UserGetSave(req.body);
      accountController.deleteAccount(userGetSave.username, function (err, resonse) {
        if (err) {
          console.log(err);
        }
        return res.send(response);
      })
    });
// router.route('/account/resetpassword')
//     .post(function (req, res) {

//         var accountController = new AccountController(User, req.session, mailer);
//         var userPasswordReset = new UserPasswordReset(req.body);
//         accountController.resetPassword(userPasswordReset.email, function (err, response) {
//             return res.send(response);
//         });
//     });

router.route("/account/clearSave").post(function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  var userSession = new UserSession(),
    accountController = new AccountController(
      User,
      req.session,
      userSession,
      mailer
    );
  var userClearSave = new UserClearSave(req.body);
  console.log(userClearSave);

  accountController.clearSave(userClearSave.username, function (err, response) {
    return res.send(response);
  });
});

router.route("/account/resetpassword").post(function (req, res) {
  var userSession = new UserSession(),
    accountController = new AccountController(
      User,
      req.session,
      userSession,
      mailer
    );
  var userPasswordResetFinal = new UserPasswordReset(req.body);

  accountController.resetPasswordFinal(
    userPasswordResetFinal.username,
    userPasswordResetFinal.newPassword,
    userPasswordResetFinal.newPasswordConfirm,
    function (err, response) {
      return res.send(response);
    }
  );
});
module.exports = router;
