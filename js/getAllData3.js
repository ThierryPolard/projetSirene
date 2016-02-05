'use strict'

var fs=require('fs'); //natif node system file read and write in file
var parse = require('csv-parse'); //read line by line csv file
var GeoJSON = require('geojson'); //package json write geoJson in the right way


var idToData = new Map();
var idToOxygene = new Map();



var getGeoP = new Promise(function(resolve, reject){
	var parser = parse({delimiter: ';', columns: true});
	var input = fs.createReadStream('../data/sites.csv'); //open stream to file

	input.pipe(parser)
	.on('data', function(data){
		// var coord = [];
		// coord.push(data.lat);
		// coord.push(data.lon);
		idToData.set(data.Id,[data.lat,data.lon]);
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
		if(idToOxygene.has(data.Id)){
			var myEntry = idToOxygene.get(data.Id)
			myEntry.set(data.temps,data.oxygene);
			idToOxygene.set(data.Id,myEntry);
		}
		else{
			var NewMap = new Map();
			NewMap.set(data.temps,data.oxygene)
			idToOxygene.set(data.Id,NewMap);
		}
	})
	.on('end', function(){
		resolve(idToOxygene);
		console.log('idToOxygene',idToOxygene)
	})
	.on('error', function(error){
		reject(error);
	})
});

var idToAllData = new Map();

Promise.all([getGeoP,getOxygeneP])
.then(function(results){
	var geo=results[0];
	var oxygene=results[1];
	geo.forEach(function(geoData,Id){
		idToAllData.set(Id,{
			coords : geoData,
			dateTooxygene : oxygene.get(Id)
		});
	});
	console.log(idToAllData.size);
	var finalOutput  = {};
idToAllData.forEach(function(data,Id){
	var dateOutput = [];
	 data.dateTooxygene.forEach(function(oxygene,date){
	 	dateOutput.push({
	 		date:date,
	 		oxygene:oxygene
	 	});
	})
	finalOutput[Id] = {
		coords:data.coords,
		oxygeneByDate: dateOutput
	};
})

console.log('finalOutput',finalOutput)

fs.writeFile('../data/allData3.json',JSON.stringify(finalOutput));
})
.catch(function(err){
	console.log('error',err);
});



var myJSON = require('../data/allData3.json');
// Transformation en Objet JS
//var datas = JSON.parse( myJSON );

console.log('myJSON',myJSON)

var myJSON = require('../data/allData3.json');


var MyGeoJSON = GeoJSON.parse(myJSON, {Point: 'coords', include:  ['Id'], exclude : ['oxygeneByDate']});
