'use strict'

var fs = require('fs'); //natif node system file read and write in file
var parse = require('csv-parse'); //read line by line csv file
var geojson = require('geojson'); //package json write geoJson in the right way
var path = require('path'); //
var parser2 = parse({delimiter: ';', columns: true});


var idToSites = new Map();
var idToParam = new Map();
var idToData  = new Map();


var getSitesP  = new Promise(function(resolve, reject){
	var parser = parse({delimiter: ';', columns: true});

	var fileFullName = path.join(__dirname,'../data/sites.csv');
	var input  = fs.createReadStream(fileFullName); //open stream to file

	input.pipe(parser)
	.on('data', function(data){
		// var coord = [];
		// coord.push(data.lat);
		// coord.push(data.lon);
		idToData.set(data.Id,[data.lat,data.lon]);
	})
	.on('end', function(){
		resolve(idToData)
		console.log ('idToData',idToData)
	})
	.on('error', function(error){
		reject(error)
	});
});


var getParamP = new Promise(function(resolve,reject){
	var parser = parse({delimiter: ';', columns: true});
	var fileFullName = path.join(__dirname,'../data/param.csv');
	var inputParam = fs.createReadStream(fileFullName); //open stream to file

	inputParam.pipe(parser)
	.on('data', function(data){

		if(idToParam.has(data.Id)){
			var myEntry = idToParam.get(data.Id)
			myEntry.set(data.temps,data.oxygene);
			idToParam.set(data.Id,myEntry);
		}
		else{
			var NewMap = new Map();
			NewMap.set(data.temps,data.oxygene)
			idToParam.set(data.Id,NewMap);
		}
	})
	.on('end', function(){
		resolve(idToParam)
		console.log('idToParam ',idToParam )
	})
	.on('error', function(error){
		reject(error);
	})
});

var idToAllData = new Map();

Promise.all([getSitesP,getParamP])
.then(function(results){
	var geo=results[0];
	var oxygene=results[1];
	var conductivite=results[2];
	console.log(geoData)
	geo.forEach(function(geoData,ID){
		idToAllData.set(ID,{
			coords : geoData,
			dateToParam : param.get(ID)
		});
	});
	console.log(idToAllData.size);
	var finalOutput  = {};
idToAllData.forEach(function(data,ID){
	var dateOutput = [];

	 data.dateToParam.forEach(function(param,date){
	 	dateOutput.push({
	 		date:date,
	 		param:param
	 	});
	})
	finalOutput[ID] = {
		coords:data.coords,
		ParamByDate: dateOutput
	};
});