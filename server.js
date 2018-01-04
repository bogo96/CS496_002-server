const express = require('express');
const app = express();
//var mongoos = require('mongoose');

/*var Schema = mongoose.Schema;
var ContactSchema = new Schema({
	name: String,
	number: String,
	email: String,
	link: String});*/

//app.use(bodyParser.urlencoded({extended: true}));
//app.user(bodyParser.json());

app.post('/post', (req, res) =>{
	console.log('/post');
	var inputdata;
	req.on('data', function(data){
		inputdata = JSON.parse(data);
		console.log(inputdata);
		for(var i=0; i<inputdata.length; i++){
			console.log("dfdf");
			console.log(inputdata[i].name);
		}
	});
	
	res.write("ok");
	res.end();
});

app.listen(3000, () => {
	console.log("Listening on port 3000");
});
