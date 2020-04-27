var AccountController = function (userModel, session, userSession, mailer) {
  this.crypto = require("crypto");
  this.uuid = require("node-uuid");
  this.ApiResponse = require("../models/api-response.js");
  this.ApiMessages = require("../models/api-messages.js");
  this.UserProfileModel = require("../models/user-profile.js");
  this.User = require("../models/user.js");
  this.UserSaves = require("../models/user-saves");
  this.Rolls = require("../models/rolls.js");
  this.userModel = userModel;
  this.session = session;
  this.userSession = userSession;
  this.mailer = mailer;
};

AccountController.prototype.getSession = function () {
  return this.session;
};

AccountController.prototype.setSession = function (session) {
  this.session = session;
};

AccountController.prototype.hashPassword = function (password, salt, callback) {
  var iterations = 10000,
    keyLen = 64;
  this.crypto.pbkdf2(password, salt, iterations, keyLen, "sha512", callback);
};

AccountController.prototype.logon = function (username, password, callback) {
  var me = this;

  me.userModel.findOne({ username: username }, function (err, user) {
    //console.log(user);

    if (err) {
      return callback(
        err,
        new me.ApiResponse({
          success: false,
          extras: { msg: me.ApiMessages.DB_ERROR },
        })
      );
    }

    if (user != null && user.passwordSalt) {
      me.hashPassword(password, user.passwordSalt, function (
        err,
        passwordHash
      ) {
        if (passwordHash == user.passwordHash) {
          var userProfileModel = new me.UserProfileModel({
            username: user.username,
            name: user.name,
            email: user.email,
          });

          //console.log(userProfileModel);

          me.session.userProfileModel = userProfileModel;
          me.session.id = me.uuid.v4();

          me.userSession.userId = user._id;
          me.userSession.sessionId = me.session.id;

          me.userSession.save(function (err, sessionData, numberAffected) {
            if (err) {
              return callback(
                err,
                new me.ApiResponse({
                  success: false,
                  extras: { msg: me.ApiMessages.DB_ERROR },
                })
              );
            }

            if (sessionData) {
              return callback(
                err,
                new me.ApiResponse({
                  success: true,
                  extras: {
                    userProfileModel: userProfileModel,
                    sessionId: me.session.id,
                  },
                })
              );
            } else {
              return callback(
                err,
                new me.ApiResponse({
                  success: false,
                  extras: { msg: me.ApiMessages.COULD_NOT_CREATE_SESSION },
                })
              );
            }
          });
        } else {
          return callback(
            err,
            new me.ApiResponse({
              success: false,
              extras: { msg: me.ApiMessages.INVALID_PWD },
            })
          );
        }
      });
    } else {
      return callback(
        err,
        new me.ApiResponse({
          success: false,
          extras: { msg: me.ApiMessages.USERNAME_NOT_FOUND },
        })
      );
    }
  });
};

AccountController.prototype.saveData = function (
  username,
  data,
  date,
  money,
  callback
) {
  var me = this;

  me.UserSaves.findOne({ username: username }, function (err, userSave) {
    if (err) {
      return callback(
        err,
        new me.ApiResponse({
          success: false,
          extras: { msg: me.ApiMessages.DB_ERROR },
        })
      );
    }

    if (userSave) {
      userSave.userMoney = money;
      userSave.gameData = data;
      userSave.creationDate = date;
      userSave.saveNumber++;

      userSave.save(function (err, saveData) {
        if (err) {
          return callback(
            err,
            new me.ApiResponse({
              success: false,
              extras: { msg: me.ApiMessages.DB_ERROR },
            })
          );
        }

        if (saveData) {
          return callback(
            err,
            new me.ApiResponse({
              success: true,
              extras: {
                userSave: saveData,
              },
            })
          );
        } else {
          return callback(
            err,
            new me.ApiResponse({
              success: false,
              extras: { msg: me.ApiMessages.COULD_NOT_CREATE_USERSAVE },
            })
          );
        }
      });
    } else {
      var userSave = new me.UserSaves({
        username: username,
        creationDate: date,
        userMoney: money,
        saveNumber: 1,
        gameData: data,
      });

      userSave.save(function (err, saveData) {
        if (err) {
          return callback(
            err,
            new me.ApiResponse({
              success: false,
              extras: { msg: me.ApiMessages.DB_ERROR },
            })
          );
        }
        if (saveData) {
          return callback(
            err,
            new me.ApiResponse({
              success: true,
              extras: {
                userSave: saveData,
              },
            })
          );
        } else {
          return callback(
            err,
            new me.ApiResponse({
              success: false,
              extras: { msg: me.ApiMessages.COULD_NOT_CREATE_USERSAVE },
            })
          );
        }
      });
    }
  });
};

AccountController.prototype.getRolls = function (callback) {
  var me = this;

  me.Rolls.find({}, function (err, rolls) {
    if (err) {
      return callback(
        err,
        new me.ApiResponse({
          success: false,
          extras: { msg: me.ApiMessages.DB_ERROR },
        })
      );
    }
    var rollList = [];
    let length = rolls.length;

    for (let i = 0; i < length; i++) {
      rollList.push(rolls[i]);
    }

    return callback(
      err,
      new me.ApiResponse({ success: false, extras: { rollList: rollList } })
    );
  });
};

AccountController.prototype.getData = function (username, callback) {
  var me = this;

  me.UserSaves.findOne({ username: username }, function (err, userSave) {
    if (err) {
      return callback(
        err,
        new me.ApiResponse({
          success: false,
          extras: { msg: me.ApiMessages.DB_ERROR },
        })
      );
    }

    if (userSave) {
      return callback(
        err,
        new me.ApiResponse({
          success: true,
          extras: {
            userSave: userSave,
          },
        })
      );
    } else {
      return callback(
        err,
        new me.ApiResponse({
          success: false,
          extras: { msg: me.ApiMessages.COULD_NOT_FIND_USERSAVE },
        })
      );
    }
  });
};

AccountController.prototype.logoff = function () {
  if (this.session.userProfileModel) delete this.session.userProfileModel;
  return;
};

AccountController.prototype.register = function (newUser, callback) {
  var me = this;

  me.userModel.findOne({ username: newUser.username }, function (err, user) {
    if (err) {
      return callback(
        err,
        new me.ApiResponse({
          success: false,
          extras: { msg: me.ApiMessages.DB_ERROR },
        })
      );
    }

    if (user) {
      return callback(
        err,
        new me.ApiResponse({
          success: false,
          extras: { msg: me.ApiMessages.USERNAME_ALREADY_EXISTS },
        })
      );
    } else {
      newUser.save(function (err, user, num) {
        if (err) {
          return callback(
            err,
            new me.ApiResponse({
              success: false,
              extras: { msg: me.ApiMessages.DB_ERROR },
            })
          );
        }

        if (user) {
          var userProfileModel = new me.UserProfileModel({
            email: user.email,
            username: user.username,
            name: user.name,
          });

          return callback(
            err,
            new me.ApiResponse({
              success: true,
              extras: {
                userProfileModel: userProfileModel,
              },
            })
          );
        } else {
          return callback(
            err,
            new me.ApiResponse({
              success: false,
              extras: { msg: me.ApiMessages.COULD_NOT_CREATE_USER },
            })
          );
        }
      });
    }
  });
};

AccountController.prototype.resetPassword = function (email, callback) {
  var me = this;
  me.userModel.findOne({ email: email }, function (err, user) {
    if (err) {
      return callback(
        err,
        new me.ApiResponse({
          success: false,
          extras: {
            msg: me.ApiMessages.DB_ERROR,
          },
        })
      );
    }

    var passwordResetHash = me.uuid.v4();
    me.session.passwordResetHash = passwordResetHash;
    me.session.userWhoRequestedPasswordReset = email;

    me.mailer.sendPasswordResetHash(email, passwordResetHash);

    return callback(
      err,
      new me.ApiResponse({
        success: true,
        extras: { passwordResetHash: passwordResetHash },
      })
    );
  });
};

AccountController.prototype.clearSave = function (username, callback) {
  var me = this;

  me.UserSaves.findOne({ username: username }, function (err, userSave) {
    if (err) {
      return callback(
        err,
        new me.ApiResponse({
          success: false,
          extras: { msg: me.ApiMessages.DB_ERROR },
        })
      );
    }

    if (userSave) {
      userSave.remove(function (err, save) {
        if (err) {
          return callback(
            err,
            new me.ApiResponse({
              success: false,
              extras: { msg: me.ApiMessages.DB_ERROR },
            })
          );
        }

        if (save) {
          return callback(
            err,
            new me.ApiResponse({
              success: true,
              extras: null,
            })
          );
        } else {
          return callback(
            err,
            new me.ApiResponse({
              success: false,
              extras: { msg: me.ApiMessages.COULD_NOT_FIND_USERSAVE },
            })
          );
        }
      });
    } else {
      return callback(
        err,
        new me.ApiResponse({
          success: false,
          extras: { msg: me.ApiMessages.COULD_NOT_FIND_USERSAVE },
        })
      );
    }
  });
};

AccountController.prototype.deleteAccount = function (username, callback) {
  var me = this;

  me.UserSaves.findOne({ username: username }, function (err, user) {
    if (err) {
        return callback(
          err,
          new me.ApiResponse({
            success: false,
            extras: { msg: me.ApiMessages.DB_ERROR },
          })
        );
      }
      if (user) {
        user.remove(function(err,doc) {
          if (err) {
            return callback(
              err,
              new me.ApiResponse({
                success: false,
                extras: { msg: me.ApiMessages.DB_ERROR },
              })
            );
          }
          if (doc) {
            return callback(
              err,
              new me.ApiResponse({
                success: true,
                extras: null,
              })
            );
          }
        })

      }
    });
}

AccountController.prototype.resetPasswordFinal = function (
  username,
  newPassword,
  newPasswordConfirm,
  callback
) {
  var me = this;

  
  // if (!me.session || !me.session.passwordResetHash) {
  //     return callback(null, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_RESET_EXPIRED } }));
  // }

  // if (me.session.passwordResetHash !== passwordResetHash) {
  //     return callback(null, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_RESET_HASH_MISMATCH } }));
  // }
  // if (me.session.emailWhoRequestedPasswordReset !== email) {
  //     return callback(null, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_RESET_EMAIL_MISMATCH } }));
  // }
  if (newPassword != newPasswordConfirm) {
    return callback(
      null,
      new me.ApiResponse({
        success: false,
        extras: { msg: me.ApiMessages.PASSWORD_CONFIRM_MISMATCH },
      })
    );
  }
  var passwordSalt = this.uuid.v4();

  me.hashPassword(newPassword, passwordSalt, function (err, passwordHash) {
    me.userModel.updateOne(
      { username: username },
      { passwordHash: passwordHash, passwordSalt: passwordSalt },
      function (err, raw) {
        if (err) {
          return callback(
            err,
            new me.ApiResponse({
              success: false,
              extras: { msg: me.ApiMessages.DB_ERROR },
            })
          );
        }

        if (raw.nModified < 1) {
          return callback(
            err,
            new me.ApiResponse({
              success: false,
              extras: { msg: me.ApiMessages.COULD_NOT_RESET_PASSWORD },
            })
          );
        } else {
          return callback(
            err,
            new me.ApiResponse({ success: true, extras: null })
          );
        }
      }
    );
  });
};

AccountController.prototype.getUserFromRegistration = function (
  userRegistrationModel
) {
  var me = this;

  if (
    userRegistrationModel.password !== userRegistrationModel.passwordConfirm
  ) {
    return new me.ApiResponse({
      success: false,
      extras: {
        msg: me.ApiMessages.PASSWORD_CONFIRM_MISMATCH,
      },
    });
  }

  var passwordSalt = this.uuid.v4(),
    cryptoIter = 10000,
    cryptoKeyLen = 64,
    passwordHash;

  var user = new this.User({
    email: userRegistrationModel.email,
    name: userRegistrationModel.name,
    username: userRegistrationModel.username,
    passwordHash: this.crypto.pbkdf2Sync(
      userRegistrationModel.password,
      passwordSalt,
      cryptoIter,
      cryptoKeyLen,
      "sha512"
    ),
    passwordSalt: passwordSalt,
  });

  return new me.ApiResponse({
    success: true,
    extras: {
      user: user,
    },
  });
};

module.exports = AccountController;
