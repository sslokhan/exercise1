// Shehzad Lokhandwalla
var express = require('express');
var router = express.Router();
var request = require("request-promise");
var fs = require("fs");
var file = "myAgro.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shehzad Lokhandwalla' });
});

router.get('/data-mine', function(req, res){
    res.render('data-mine');
  });

router.get('/newclient', function(req, res){
    res.render('newclient', {title: 'New Data Entry'});
});

router.post('/addclient1', function(req, res){
	var name = req.body.name;
	var sex = req.body.sex;
	var phone = req.body.phone;
	console.log(name);
    res.render('newclient1', {title: 'New Data Entry', phone:phone, name:name, sex:sex});
});

router.post('/addclient', function(req, res){
 	var db = new sqlite3.Database(file);
 	var selection =[];
 	db.serialize(function() {
	 	if(!exists) {

	 		//Initializing indexes
	 		var client_id=1;
	  		var saving_id=1;
	  		var product_id=1;

	 		//Creating tables
		    db.run("CREATE TABLE client(client_id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, name TEXT, sex TEXT, phone TEXT)");
		    db.run("CREATE TABLE saving_goals(saving_id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,land_size REAL, saving_amount INTEGER,completed INTEGER, active INTEGER, client_id INTEGER, foreign key(client_id) references client(client_id) ON DELETE CASCADE ON UPDATE CASCADE); )");
		    db.run("CREATE TABLE goal_items(product_id INTEGER PRIMARY KEY, saving_id INTEGER, land_size REAL,foreign key(saving_id,land_size) references saving_goals(saving_id,land_size) ON DELETE CASCADE ON UPDATE CASCADE); )");
		    db.run("CREATE TABLE product(product_id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, product_name TEXT)");

		    //Initializing Products
		    var products=["Maze with Fertilizer","Maze without Fertilizer","Peanuts with Fertilizer","Peanuts without Fertilizer"]
		    for (i=0;i<products.length;i++)
		    	db.run("INSERT INTO product (product_name) VALUES (?)",[products[i]]);

	  	}
  		db.run("INSERT INTO client (name, sex, phone) VALUES (?,?,?)",[req.body.name, req.body.sex, req.body.phone]);
  		db.run("INSERT INTO saving_goals (land_size, active, saving_amount) VALUES (?,?,?)",[req.body.land_size,1,req.body.saving_amount]);
  		selection=req.body.product_name;
  		for(i=0;i<selection.length;i++)
  			db.run("INSERT INTO goal_items (product_id) SELECT product_id from product WHERE product_name=(?)",[selection[i]]);


	});
	db.close();
	res.render('index', {title: 'Successfully entered'});
});

 
module.exports = router;
 