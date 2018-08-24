var express = require('express');
var router = express.Router();
const mysql=require('mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.query);
	let conn=mysql.createConnection({
		host:"127.0.0.1",
		user:"pi",
		password:"nccutest",
		database:"ITRIProject"
	});
	
	conn.connect(function(err){
		
		if(!err){
			let sql="SELECT * FROM `container` WHERE 1";
			conn.query(sql,function(err,ressql){
				if(!err){
					//console.log(ressql);
					res.send(JSON.stringify(ressql));

				}	
			});

		}
		
	});
	
	//res.render('index', { title: 'Express' });
});

router.post('/save',function(req,res,next){

	let data=JSON.parse(req.body.data);
	
	let conn=mysql.createConnection({
		host:"127.0.0.1",
		user:"pi",
		password:"nccutest",
		database:"ITRIProject"
	});

	conn.connect(function(err){
		if(!err){
			let sql;
			if(data.mac != undefined && data.gps != undefined && data.temperature != undefined && data.humidity != undefined && data.info != undefined)
				sql="INSERT INTO `container`(`pi_mac`, `lat`, `lng`, `temperature`, `humidity`, `info`) VALUES ('"+data.mac+"','"+data.gps.lat+"','"+data.gps.lng+"','"+data.temperature+"','"+data.humidity+"','"+data.info+"')";
			conn.query(sql,function(err,res){
				
			});
		
		}else{
			console.log(err);
		}
	});
});

module.exports = router;
