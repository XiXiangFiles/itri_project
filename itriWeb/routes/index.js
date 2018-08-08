var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getTemperture',function(req,res,next){
	const imu=require('node-sense-hat').Imu;
	const IMU=new imu.IMU();
	let temperature;
	IMU.getValue(function(err,data){
		if(err!=null){
			return;	
		}
		res.send(data.temperature.toFixed(2).toString());
	});
});

module.exports = router;
