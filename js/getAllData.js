'use strict'

var fs=require('fs'); //natif node system file read and write in file
var parse = require('csv-parse'); //read line by line csv file
var GeoJSON = require('geojson'); //package json write geoJson in the right way


var idToData = new Map();
var idToParam = new Map();



var getGeoP = new Promise(function(resolve, reject){
	var parser = parse({delimiter: ';', columns: true});
	var input = fs.createReadStream('../data/sites.csv'); //open stream to file

	input.pipe(parser)
	.on('data', function(data){
		// var coord = [];
		// coord.push(data.lat);
		// coord.push(data.lon);
		idToData.set(data.Id,[parseFloat(data.lat), parseFloat(data.lon)]);
	})
	.on('end', function(){
		resolve(idToData)
		console.log('idToData',idToData)
	})
	.on('error', function(error){
		reject(error)
	});
});

var getOxygeneP = new Promise(function(resolve,reject){
	var parser = parse({delimiter: ';', columns: true});
	var inputOxygene = fs.createReadStream('../data/param.csv'); //open stream to file

	inputOxygene.pipe(parser)
	.on('data', function(data){
		if(idToParam.has(data.Id)){
			var myEntry = idToParam.get(data.Id)
			myEntry.set(data.temps,{
				oxygene: parseFloat(data.oxygene),
				conduct: parseFloat(data.conductivity)
			});
			idToParam.set(data.Id,myEntry);
		}
		else{
			var NewMap = new Map();
			NewMap.set(data.temps,{
				oxygene: parseFloat(data.oxygene),
				conduct: parseFloat(data.conductivity)
			})
			idToParam.set(data.Id,NewMap);
		}
	})
	.on('end', function(){
		resolve(idToParam);
		console.log('idToParam',idToParam)
	})
	.on('error', function(error){
		reject(error);
	})
});

var idToAllData = new Map();
Promise.all([getGeoP,getOxygeneP])
.then(function(results){
	var geo=results[0];
	var param=results[1];
	geo.forEach(function(geoData,Id){
		idToAllData.set(Id,{
			coords : geoData,
			dateToParamByDate : param.get(Id)
		});
	});
	console.log(idToAllData.size);
	var finalOutput  = [];
	idToAllData.forEach(function(data,Id){
		var dateOutput = [];
		 data.dateToParamByDate.forEach(function(param,date){
		 	console.log('PARAM', param);
		 	dateOutput.push({
		 		date:date,
		 		param:param
		 	});
		});
		finalOutput.push({
			Id:Id,
			coords:data.coords,
			paramByDate: dateOutput
		});
	});

	fs.writeFile('../data/allData.json',JSON.stringify(finalOutput));
})
.catch(function(err){
	console.log('error',err);
});