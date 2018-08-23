const serial = require('serialport');
const sensor= require("node-dht-sensor");
const request=require('request');
const fs=require('fs');
function main(){
	let obj={};
	let port = new serial('/dev/serial/by-id/usb-Prolific_Technology_Inc._USB-Serial_Controller_D-if00-port0',{
		 baudRate: 4800
	});
	let buf="";
	port.on('data',function(data){
		if(data=='$'){
		
			if(buf.includes("$GPGGA")){
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
		let str;
		var dateTime = require('node-datetime');
		var dt = dateTime.create();
		var formatted = dt.format('Y-m-d H:M:S');
		require('getmac').getMac({iface: 'wlan0'}, function(err, macAddress){
			obj.mac=macAddress;
		});

		sensor.read(11, 21, function(err, temperature, humidity){
			obj.temperature=temperature;
			obj.humidity=humidity;
		});
		if(obj.temperature!==undefined && obj.gps!==undefined){
			str=obj.mac+","+formatted+","+obj.temperature+","+obj.humidity+","+obj.gps.lat+","+obj.gps.lng+","+"test\n";
			fs.appendFile('sensorDate.csv', str, function (err) {
				if (err) throw err;
					 console.log('Saved!');
			});
		/*	
		 *
		 *	這裡開始寫區塊練合約
		 *	
		 *
		 *
		 *
		 *	*/
		}
	},1000);
}
main();
