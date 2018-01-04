module.exports = function(app, Contact)
{
	//add contacts
	app.post('/api/contacts', function(req, res){
		console.log('api/contacts');
		
		for(var i=0;i<req.body.length;i++){	
			addContact(req.body[i].name, req.body[i].number, req.body[i].email, req.body[i].link);
		}
		console.log("success");
   		res.json({result: 1});
		res.end();
	});

	app.get('/api/getallcontacts', function(req, res){
		console.log('/api/getallcontacts');
		Contact.find({}, function(err, contacts){
			if(err) return res.status(500).send({error: 'database failure'});
			res.json(contacts);
		});
	});
	
	function addContact(name, number, email, link){
		Contact.findOne({name:name, number:number, email:email, link:link}, function(err, con){
			if(!con){
				var contact = new Contact({name:name, number:number, email:email, link:link});
				contact.save(function(err){
					if(err){
						console.error(err);
					}
				});
			}
		});
	}

}
