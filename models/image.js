var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
		id : String,
		img : String,
});

module.exports = mongoose.model('image',ImageSchema);
