var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var RollsSchema = new Schema({
    name: String,
    type: String,
    inner: [String],
    outer: [String],
    nori: Boolean,
    description: String
});

module.exports = mongoose.model('Rolls',RollsSchema);