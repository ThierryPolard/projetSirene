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
	geo.forEach(function(geoData,ID){
		idToAllData.set(ID,{
			coords : geoData,
			dateToOxygeneByDate : oxygene.get(ID)
		});
	});
	console.log(idToAllData.size);
	var finalOutput  = {};
idToAllData.forEach(function(data,ID){
	var dateOutput = [];
	 data.dateToOxygeneByDate.forEach(function(oxygene,date){
	 	dateOutput.push({
	 		date:date,
	 		oxygene:oxygene
	 	});
	})
	finalOutput[ID] = {
		coords:data.coords,
		OxygeneByDateByDate: dateOutput
	};
})

fs.writeFile('../data/allData4.json',JSON.stringify(finalOutput));
})
.catch(function(err){
	console.log('error',err);
});


console.log('finalOutput',finalOutput);


var finalOutput2 = [];

//finalOutput.forEach(function(Id, coords, OxygeneByDate ){
//   finalOutput2.push({
//  	 name: Id,
//  	 coords:coords,
//   	 OxygeneByDate : OxygeneByDate
//   });
//});



//var MyGeoJSON = GeoJSON.parse(finalOutput2, {Point: 'coords'});



//var myJSON = require('../data/allData4.json');
//console.log('myJSON',myJSON);


//var fichierendur = JSON.stringify(MyGeoJSON); // je convertis mon objetJSON en texte pur pour pouvoir l'écrire dans un fichier

//fs.writeFile('MyGeoJSON4.geojson', fichierendur );