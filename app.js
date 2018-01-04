var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
//var multer 		= require('multer');
//var upload = multer({dest:'./static/'});

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function(){
	console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/CS496');

var Contact  = require('./models/contact');
var Image = require('./models/image');
var User = require('./models/users');


app.use(bodyParser.urlencoded({limit:'50mb', extended: true }));
app.use(bodyParser.json({limit:'50mb'}));

var port = process.env.PORT || 8080;

var router = require('./routes')(app, Contact);
//var router2 = require('./routes/imageIndex.js')(app,Image);
var router2 = require('./routes/userIndex.js')(app, User, Image);

var server = app.listen(port, function(){
 console.log("Express server has started on port " + port)
});
