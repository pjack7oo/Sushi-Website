var UserPasswordReset = function(cnf) {
    this.username = cnf.username,
    this.newPassword = cnf.newPassword,
    this.newPasswordConfirm = cnf.newPasswordConfirm
};

module.exports = UserPasswordReset;