const serial = require('serialport');
const sensor= require("node-dht-sensor");
const request=require('request');

function main(){
	let obj={};
	let port = new serial('/dev/serial/by-id/usb-Prolific_Technology_Inc._USB-Serial_Controller_D-if00-port0',{
		 baudRate: 4800
	});
	let buf="";
	port.on('data',function(data){
		if(data=='$'){
		
			if(buf.includes("$GPGGA")){
				//console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~"+buf);
				let str;
				let gps={};
				str=buf.split(',');
				gps.lat=parseFloat(str[2])/100;
				gps.lng=parseFloat(str[4])/100;
				obj.gps=gps;
			}
			buf="";
		}

		buf += data.toString('ascii');
	
		
	});
	setInterval(function(){
		sensor.read(11, 21, function(err, temperature, humidity){
			obj.temperature=temperature;
		});
		console.log(obj);
		request.post({
			url:"http://192.168.4.206/test.php",
			form:{test:"test"}
		},function(err,res,body){
			console.log(body);		
		});
	},1000);
}
main();
