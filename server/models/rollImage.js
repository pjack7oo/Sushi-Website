var mongoose = require('mongoose'),
    Schema  = mongoose.Schema;

var ImageSchema = new Schema({
    data:Buffer, 
    contentType: String
}, {_id:false});

module.exports = ImageSchema;