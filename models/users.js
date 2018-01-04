var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	userid : String,
	contact : [{name : String, number : String, email : String, link : String}],
	maps : [{longitude : String, latitude : String, Tag : String, title: String}],
	image : [{img: String,}]
});

module.exports = mongoose.model('user', UserSchema);
