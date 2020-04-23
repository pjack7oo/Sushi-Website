
const expect = require('chai').expect
const request = require('request');
const server = require('../index.js');

var AccountController = require('../controllers/account.js'),
    mongoose = require('mongoose'),
    should = require('should'),
    uuid = require('node-uuid'),
    crypto = require('crypto'),
    User = require('../models/user.js'),
    UserMock = require('./user-mock.js'),
    UserSessionMock = require('./user-session-mock.js');
    UserRegistration = require('../models/user-registration.js'),
    MailerMock = require('./mailer-mock.js'),
    ApiMessages = require('../models/api-messages.js');

//Start the app
// const env = Object.assign({}, process.env, {PORT: 5000});
// const child = spawn('node', ['index.js'], {env});

// test('responds to requests', (t) => {
//   t.plan(4);

//   // Wait until the server is ready
//   child.stdout.on('data', _ => {
//     // Make a request to our app
//     request('http://127.0.0.1:5000', (error, response, body) => {
//       // stop the server
//       child.kill();

//       // No error
//       t.false(error);
//       // Successful response
//       t.equal(response.statusCode, 200);
//       // Assert content checks
//       t.notEqual(body.indexOf("<title>Node.js Getting Started on Heroku</title>"), -1);
//       t.notEqual(body.indexOf("Getting Started on Heroku with Node.js"), -1);
//     });
//   });
// });
describe('test', () => {

  

  it('should return 200 status code', function(done) {
    request('http://localhost:5000', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should return 404 status code', function(done) {
    request('http://localhost:5000/about', function(error, response, body) {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });

  after( function(done) {
    server.close();
    delete require.cache[require.resolve('../index.js')];
    done();
  });
});

describe('AccountController', function () {

  var controller,
      seedUsersCount = 10,
      testUser,
      userModelMock,
      userSessionMock,
      session = {},
      mailMock;

  beforeEach(function (done) {
      userModelMock = new UserMock();
      mailerMock = new MailerMock();
      userSessionMock = new UserSessionMock();
      controller = new AccountController(userModelMock, session, userSessionMock, mailerMock);
      done();
  });

  afterEach(function (done) {
      userModelMock.setError(false);
      done();
  });

  

  describe('#logon', function () {

      it('Returns db error', function (done) {

          userModelMock.setError(true);
          userModelMock.seedUsers();
          var testUser = userModelMock.getTestUser(),
              testUserPassword = 'Password0';

          controller.logon(testUser.username, testUserPassword, function (err, apiResponse) {

              should(apiResponse.success).equal(false);
              should(apiResponse.extras.msg).equal(ApiMessages.DB_ERROR);
              done();
          });
      });

      it('Creates user session', function (done) {

          userModelMock.seedUsers();
          var testUser = userModelMock.getTestUser(),
              testUserPassword = 'Password0';            

          controller.logon(testUser.username, testUserPassword, function (err, apiResponse) {
              
              
              if (err) return done(err);
              should(apiResponse.success).equal(true);
              should.exist(apiResponse.extras.userProfileModel);
              should.exist(controller.getSession().userProfileModel);
              should.exist(controller.getSession().id);
              should.exist(apiResponse.extras.sessionId);
              should(apiResponse.extras.userProfileModel).equal(controller.getSession().userProfileModel);
              done();
          });
      });

      it('Returns "Username not found"', function (done) {

          userModelMock.seedUsers();
          var testUser = userModelMock.getTestUser(),
              testUserPassword = 'Password0',
              nonExistentusername = 'test';

          controller.logon(nonExistentusername, testUserPassword, function (err, apiResponse) {

              if (err) return done(err);
              should(apiResponse.success).equal(false);
              should(apiResponse.extras.msg).equal(ApiMessages.USERNAME_NOT_FOUND);
              done();
          });
      });

      it('Returns "Invalid password"', function (done) {

          userModelMock.seedUsers();
          var testUser = userModelMock.getTestUser(),
              invalidPassword = 'Password';

          controller.logon(testUser.username, invalidPassword, function (err, apiResponse) {

              if (err) return done(err);
              should(apiResponse.success).equal(false);
              should(apiResponse.extras.msg).equal(ApiMessages.INVALID_PWD);
              done();
          });
      });
  });

  describe('#logoff', function () {
      it('Destroys user session', function (done) {
          controller.logoff();
          should.not.exist(controller.getSession().userProfileModel);
          done();
      });
  });

  describe('#register', function () {

      it('Returns db error', function (done) {

          userModelMock.setError(true);
          userModelMock.seedUsers();
          var testUser = userModelMock.getTestUser();
          controller.register(testUser, function (err, apiResponse) {

              should(apiResponse.success).equal(false);
              should(apiResponse.extras.msg).equal(ApiMessages.DB_ERROR);
              done();
          });
      });

      it('Returns "Email already exists"', function (done) {
                      
          userModelMock.seedUsers();
          var testUser = userModelMock.getTestUser();
          controller.register(testUser, function (err, apiResponse) {
              
              
              should(apiResponse.success).equal(false);
              should(apiResponse.extras.msg).equal(ApiMessages.USERNAME_ALREADY_EXISTS);
              done();
          });
      });

    //   it('Returns "Could not create user"', function (done) {
          
    //       var testUser = new UserMock();
    //       testUser.setNumberAffected(0);

    //       controller.register(testUser, function (err, apiResponse) {

    //           if (err) return done(err);
    //           should(apiResponse.success).equal(false);
    //           should(apiResponse.extras.msg).equal(ApiMessages.COULD_NOT_CREATE_USER);
    //           done();
    //       });
    //   });

      it('Registers a user', function (done) {

          var testUser = new UserMock();
          testUser.setNumberAffected(1);

          controller.register(testUser, function (err, apiResponse) {

              if (err) return done(err);
              should(apiResponse.success).equal(true);
              done();
          });
      });
  });

  describe('#getUserFromUserRegistration', function () {
    it('Returns "Password confirm mismatch"', function (done) {
        var testUserRegistration = new UserRegistration({
            email: 'test@test.com',
            name: 'irrelevant',
            username: 'irrelevant',
            password: 'password1',
            passwordConfirm: 'password2'
        });
        var apiResponse = controller.getUserFromRegistration(testUserRegistration);
        should(apiResponse.success).equal(false);
        should(apiResponse.extras.msg).equal(ApiMessages.PASSWORD_CONFIRM_MISMATCH);
        done();
    });
    it('Returns User Model', function (done) {
        var testUserRegistration = new UserRegistration({
            email: 'test@test.com',
            name: 'irrelevant',
            username: 'irrelevant',
            password: 'password',
            passwordConfirm: 'password'
        });
        var apiResponse = controller.getUserFromRegistration(testUserRegistration);
        should(apiResponse.success).equal(true);
        should(apiResponse.extras.user).be.an.instanceof(User);
        done();
    });
  });
});