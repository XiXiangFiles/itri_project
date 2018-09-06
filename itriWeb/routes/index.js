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
		console.log(req.query.id);
		if(!err){
			if(req.query.id != undefined && req.query.id != ""){
				console.log("進去"+req.query.id);
				let sql=`SELECT * FROM container WHERE pi_mac = '${req.query.id}'`;
				conn.query(sql,function(err,ressql){
					if(!err){
						//console.log(ressql);
						res.send(JSON.stringify(ressql));

					}	
				});
			}
			else{
				console.log("沒有進去"+req.query.id);
				let sql="SELECT * FROM `container` WHERE 1";
				conn.query(sql,function(err,ressql){
					if(!err){
						//console.log(ressql);
						res.send(JSON.stringify(ressql));

					}	
				});
			}

		}
		
	});
	
	//res.render('index', { title: 'Express' });
});

router.post("/save",function(req,res){

	let data=JSON.parse(req.body.data);

	let conn=mysql.createConnection({
		host:"127.0.0.1",
		user:"pi",
		password:"nccutest",
		database:"ITRIProject"
	});

	conn.connect(function(err){
		if(!err){
			let sql="";
			if(data.mac != undefined && data.gps != undefined && data.temperature != undefined && data.humidity != undefined && data.info != undefined)
				sql="INSERT INTO `container`(`pi_mac`,`timestamp`, `lat`, `lng`, `temperature`, `humidity`, `info`) VALUES ('"+data.mac+"','"+data.timestamp+"','"+data.gps.lat+"','"+data.gps.lng+"','"+data.temperature+"','"+data.humidity+"','"+data.info+"')";
				
			console.log("sql= "+sql);
			conn.query(sql,function(err,res){
				
			});
		
		}else{
			console.log(err);
		}
	});
});

router.get('/getDataByIdTime', function(req, res, next) {
	console.log(req.query);
	let conn=mysql.createConnection({
		host:"127.0.0.1",
		user:"pi",
		password:"nccutest",
		database:"ITRIProject"
	});
	
	conn.connect(function(err){
		
		if(!err){
			let sql=`SELECT * FROM container WHERE pi_mac = '${req.query.id}' AND timestamp BETWEEN '${req.query.timestampstart}' AND '${req.query.timestampend}' `;
			conn.query(sql,function(err,ressql){
				if(!err){
					console.log("ressql: "+ressql);
					res.send(JSON.stringify(ressql));

				}	
				else{
					console.log(err);
				}
			});

		}
		
	});
	
	//res.render('index', { title: 'Express' });
});

module.exports = router;
