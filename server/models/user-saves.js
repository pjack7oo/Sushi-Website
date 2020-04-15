var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSavesSchema = new Schema({
    username: String,
    creationDate: Date,
    userMoney : Number,
    saveNumber: Number,
    gameData: String

});

module.exports = mongoose.model('UserSaves', UserSavesSchema);