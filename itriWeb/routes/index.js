var express = require('express');
var router = express.Router();
const mysql=require('mysql');


/* GET home page. */
router.get('/', function(req, res, next) {
	// console.log(req.query);
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
				let sql=`SELECT * FROM container WHERE pi_mac = '${req.query.id}'`;
				conn.query(sql,function(err,ressql){
					if(!err){
						//console.log(ressql);
						res.send(JSON.stringify(ressql));

					}	
				});
			}
			else{
				let sql="SELECT * FROM `container` WHERE 1";
				conn.query(sql,function(err,ressql){
					if(!err){
						//console.log(ressql);
						res.send(JSON.stringify(ressql));

					}	
				});
			}
			conn.end();

		}
		
	});
	
	//res.render('index', { title: 'Express' });
});

router.post("/save",function(req,response){

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
				sql="INSERT INTO `container`(`pi_mac`, `timestamp` ,`lat`, `lng`, `temperature`, `humidity`,`Id`,`Contract_Address`,`Transaction_Hash`,`info`) VALUES ('"+data.mac+"','"+data.timestamp+"','"+data.gps.lat+"','"+data.gps.lng+"','"+data.temperature+"','"+data.humidity+"','"+data.Id+"','"+data.Contract_Address+"','"+data.Transaction_Hash+"','"+data.info+"')";
				
			console.log("sql= "+sql);
			conn.query(sql,function(err,res){
				if(err){
					response.write("false");
					response.end();
				}else{
					response.write('true');
					response.end();
				}
			});
		
		}else{
			console.log(err);
		}
		conn.end();
	});
});

router.get('/getDataByIdTime', function(req, res, next) {
	// console.log(req.query);
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
				conn.end();
			});

		}
		
	});
	
	//res.render('index', { title: 'Express' });
});

module.exports = router;
