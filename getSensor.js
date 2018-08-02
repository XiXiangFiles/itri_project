const imu = require('node-sense-hat').Imu;
const IMU = new imu.IMU();
const serial = require('serialport');


function main(){
	let obj={};
	let port = new serial('/dev/serial/by-id/usb-u-blox_AG_-_www.u-blox.com_u-blox_7_-_GPS_GNSS_Receiver-if00',{
		 baudRate: 9600
	});
	port.on('data',function(data){
		//console.log(data.toString('ascii'));
		obj.gps=data.toString('ascii');	
		
	});
	setInterval(function(){
		IMU.getValue(function(err,data){
				if(err!=null){
					console.log("failed to get data");
					return ;
				}
				obj.temperature=data.temperature;
				console.log(obj);
		});
	
	},1000);
}
main();
