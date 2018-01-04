var count = 0;
module.exports = function(app, User, Image){

	app.post('/api/newuser', function(req, res){
		console.log('api/newuser');
		console.log(req.body[0].id);
		addNewUser(req.body[0].id, res);
	});

	app.post('/api/addnewcontacts', function(req, res){
		console.log('api/addnewcontacts');
		for(var i=0; i<req.body.length; i++){
			var id = req.body[i].id;
			var name = req.body[i].name;
			var number = req.body[i].number;
			var email = req.body[i].email;
			var link = req.body[i].link;
			addNewContact(id, name, number, email, link);
		}
		console.log("success");
		res.json({result:1});
		res.end();
	});

	app.get('/api/getallcontact/:id', function(req, res){
		console.log('api/getallcontacts');
		var id = req.params.id;
		User.find({userid:id}, function(err, usr){
			console.log(id);
			if(err) return res.status(500).send({error: 'database failure'});
			res.json(usr[0].contact);
			res.end();
		});
		console.log('success');
	});

	app.delete('/api/deletecontact',function(req, res){
		console.log('/api/deletecontact');
		var id = req.body[0].id;
		var name = req.body[0].name;
		var number = req.body[0].number;
		var email = req.body[0].email;
		var link = req.body[0].link;
		deleteUserContact(id, name, number, email, link, res);
		console.log("success");
	});


	 app.post('/api/images',function(req,res){
     	console.log('api/images post');
		addImage(req.body[0].id,req.body[0].img, res);
        console.log("image save indexImage");
		//res.json({result:10});
        //res.end();
  	});

    app.get('/api/images/:id',function(req,res){
		console.log('api/images get');
		console.log(count);
		//console.log(req.params.id);
	
		User.find({userid:req.params.id},function(err,user){
			if(err){
				console.log(err);
				return res.status(500).end('Database error');
			}
			var imgs = user[0].image;
			console.log(imgs.length);
			/*if(imgs.length==1){
				console.log("short");
				
				res.json(imgs);
			}else{*/
				//console.log("long");
				//console.log(imgs.length);
				if (imgs.length > count){
					console.log("long");
					Image.findOne({id:imgs[count].img}, function(err, one){
						//count++;
						console.log("in");
						//:w
						//console.log(Image);
						if(err){
							console.log("no match id in delete");
							return res.status(500).end('Database error');
						}
						//console.log(one);
						//console.log("find success");
						//console.log({imgid:imgs[count], img:one[0].img});
						//res.json({imgid:imgs[count], imgdecode:one[0].img});
						res.json(one);
						//console.log("end res");
						count++;
						res.end();
					});
					//res.json(imgs[count]);
					//count++;
				}else{
					console.log("the end");
					res.json({img:"end"});
					count=0;
					res.end();
				}
			//}
			//res.end();
		});
	});
	
	app.delete('/api/images',function(req,res){
		console.log('api/images delete');
		deleteUserImage(req.body[0].id, req.body[0].img, req.body[0].imgid, res);
		console.log('delete image success');
	});

	app.post('/api/maps', function(req, res){
		console.log('/spi/maps');
		for(var i = 0; i<req.body.length; i++){
			var id = req.body[i].id;
			var longitude = req.body[i].longitude;
			var latitude = req.body[i].latitude;
			var notgo = req.body[i].Tag;
			var note = req.body[i].title;
			addNewMapNote(id, longitude, latitude, notgo, note);
		}
		res.json({result:1});
		res.end();
	});
	
	app.delete('/api/maps', function(req, res){
		console.log('api/deletenote');
		console.log(req.body[0]);
		var id = req.body[0].id;
		var longitude = req.body[0].longitude;
		var latitude = req.body[0].latitude;
		deleteMapNote(id, longitude, latitude, res);
		console.log("success");
	});

	app.get('/api/maps/:id', function(req, res){
		console.log('api/maps get');
		var id = req.params.id;
		console.log(id);
		User.find({userid:id}, function(err, user){
			console.log(user[0].userid);
			var maps = user[0].maps;
			console.log(maps);
			res.json(maps);
			res.end();
		});
		console.log('success');
	});

	app.put('/api/maps',function(req,res){
		console.log('/api/maps update');
		var id = req.body[0].id;
		var longitude = req.body[0].longitude;
		var latitude = req.body[0].latitude;
		var tag = req.body[0].Tag;
		var title = req.body[0].title;
		updateMap(id,longitude,latitude,tag,title);
		res.json({result:1});
		res.end();
	});


	function addImage(id,byteImg, res){
		Image.count({}, function(err, len){
			//console.log(len);
			var imgOne = Image({id:len, img:byteImg});
			imgOne.save(function(err){
				if(err){
					console.error(err);
				}
				User.findOne({userid:id}, function(err, user){
					if(err){
						console.err(err);
					}
					console.log("userfindone");
					//console.log(user.userid);
					//console.log(user.image);
					if(!user.image){
						console.log("first");
						user.image = [{img:len}]
					}
					else{
						console.log("push");
						user.image.push({img:len});
					}
					user.save(function(err){
						if(err){
							console.error(err);
						}
						console.log("save");
					});
				});
				//console.log("imgdid");
				//console.log(len);
				res.json({result:len});
				res.end();
			});
		});
		/*imgOne.save(function(err){
			if(err){
				console.error(err);
			}

		});
		User.findOne({userid:id},function(err,user){
			if(!user.image){
				user.image = [{img:byteImg}];
			}else{
				user.image.push({img:byteImg});
			}
			user.save(function(err){
				if(err){
					console.error(err);
				}
			});
		});*/
  	}

	function addNewUser(id, res){
		User.findOne({userid:id}, function(err, user){
			if(!user){
				console.log("not");
				var usr = new User({userid:id});
				usr.save(function(err){
					if(err){
						console.error(err);
						res.json({error:"save failure"});
						return;
					}
					res.json({result:1});
					res.end();
				});
			}
			else{
				console.log("exist");
				res.json({result:0});
				res.end();
			}
		});
	}

	function addNewContact(id, name, number, email, link){
		User.findOne({userid:id}, function(err, user){
			if(!user.contact){
				user.contact = [{name:name, number:number, email:email, link:link}];
			}
			else{
				user.contact.push({name:name, number:number, email:email, link:link});
			}	
			user.save(function(err){
				if(err) console.log("save fail");
			});
		});
	}

	function addNewMapNote(id, longitude, latitude, notgo, note){
		console.log(notgo);
		console.log(note);
		User.findOne({userid:id}, function(err, user){
			if(!user.maps){
				user.maps = [{longitude:longitude, latitude:latitude, Tag:notgo, title:note}];
			}
			else{
				user.maps.push({longitude:longitude, latitude:latitude, Tag:notgo, title:note});
			}
			user.save(function(err){
				if(err) {
					console.log("map note save fail");
				}
			});
		});
	}

	function updateMap(id,longitude,latitude,tag,title){
		console.log(tag);
		User.findOne({userid:id}, function(err,user){
			var map = user.maps;
			for (var i=0; i<map.length; i++){
				var m=map[i];
				if(m.longitude == longitude && m.latitude == latitude){
					console.log(tag);
					map[i].Tag = tag;
					break;
				}
			}
			user.maps = map;
			user.save(function(err){
				if(err){
					console.log(err);
				}
			});
		});
	}

			

	function deleteUserImage(id, img, imgid, res){
		User.findOne({userid:id},function(err,user){
			console.log(id);
			//console.log(user);
			if(err){
				console.log("delete function error");
			}
			var images = user.image;
			console.log(images);
			for ( var i=0; i<images.length; i++){
				console.log(images[i].img);
				console.log(imgid);
				if(imgid == images[i].img){
					console.log(imgid);
					images.splice(i,1);
					user.image = images;
					user.save(function(err){
						if(err){
							console.error(err);
						}
					});
					Image.remove({id:imgid}, function(err, user){
						res.json({result:418});
						res.end();
					});
					break;
				}
			}
			/*user.image = images;
			user.save(function(err){
				if(err){
					console.error("delete function save error");
					res.json({result:-10});
					res.end();
				}else{
					res.json({result:418});
					res.end();
				}
			});*/
		});
	
	}

	function deleteUserContact(id, name, number, email, link, res){
		User.findOne({userid:id}, function(err, user){
			if(err) console.log("error");
			var contacts = user.contact;
			console.log({name:name, number:number, email:email, link:link});
			for(var i=0; i<contacts.length; i++){
				var c = contacts[i]
				if(c.name==name && c.number==number && c.email==email && c.link==link){
					contacts.splice(i, 1);
					break;
				}
			}
			user.contact = contacts;
			user.save(function(err){
				if(err){
					console.error(err);
					res.json({result:0});
					res.end();
				}
				else{
					res.json({result:1});
					res.end();
				}
			});
		});
	}

	function deleteMapNote(id, longitude, latitude,res){
		User.findOne({userid:id}, function(err, user){
			var map = user.maps;
			for(var i=0; i<map.length; i++){
				var m = map[i];
				if(m.longitude == longitude && m.latitude == latitude){
					map.splice(i, 1);
					break;
				}
			}
			user.maps = map;
			user.save(function(err){
				if(err){
					console.error(err);
					res.json({result:0});
					res.end();
				}
				else{
					res.json({result:1});
					res.end();
				}
			});
		});
	}
}
