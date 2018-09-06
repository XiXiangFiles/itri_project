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
		let dateTime = require('node-datetime');
		let dt = dateTime.create();
		let formatted = dt.format('Y-m-d H:M:S');
		obj.timestamp=formatted;
		require('getmac').getMac({iface: 'wlan0'}, function(err, macAddress){
			obj.mac=macAddress;
		});

		sensor.read(11, 21, function(err, temperature, humidity){
			obj.temperature=temperature;
			obj.humidity=humidity;
		});
		if(obj.temperature!==undefined && obj.gps!==undefined){
			str=obj.mac+","+formatted+","+obj.temperature+","+obj.humidity+","+obj.gps.lat+","+obj.gps.lng+","+"test\n";
			obj.info="NULL";
			fs.appendFile('sensorDate.csv', str, function (err) {
				if (err) throw err;
					 console.log('Saved!');
			});
			console.log(obj);
			request.post({url:"http://192.168.4.204:3000/save", form: {data:JSON.stringify(obj)}}, function(err,httpResponse,body){ 
				console.log(obj);
			})

			//request.post("http://192.168.4.204:3000/save").form(obj);
		}
	
	},5000);
}
main();
