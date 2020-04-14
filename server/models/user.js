var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: String,
    username: String,
    name: String,
    passwordHash: String,
    passwordSalt: String
});

module.exports = mongoose.model('User', userSchema);