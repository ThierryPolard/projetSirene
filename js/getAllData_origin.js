'use strict'

var fs=require('fs'); //natif node system file read and write in file
var parse = require('csv-parse'); //read line by line csv file
var geojson = require('geojson'); //package json write geoJson in the right way


var parser2 = parse({delimiter: ';', columns: true});


// var geoData = [];
var idToData = new Map();
var idToConso = new Map();

// idToData.set(key, value);
// idToData.get(key);

var getGeoP = new Promise(function(resolve, reject){
	var parser = parse({delimiter: ';', columns: true});
	var input = fs.createReadStream('data/Formation ANTS - Données géoloc.csv'); //open stream to file

	input.pipe(parser)
	.on('data', function(data){
		// var coord = [];
		// coord.push(data.lat);
		// coord.push(data.lon);
		idToData.set(data.ID,[data.lat,data.lon]);
	})
	.on('end', function(){
		resolve(idToData)
	})
	.on('error', function(error){
		reject(error)
	});
});

var getConsoP = new Promise(function(resolve,reject){
	var parser = parse({delimiter: ';', columns: true});
	var inputConso = fs.createReadStream('data/Formation ANTS - Données conso.csv'); //open stream to file

	inputConso.pipe(parser)
	.on('data', function(data){
		if(idToConso.has(data.ID)){
			var myEntry = idToConso.get(data.ID)
			myEntry.set(data.J,data.vol);
			idToConso.set(data.ID,myEntry);
		}
		else{
			var NewMap = new Map();
			NewMap.set(data.J,data.vol)
			idToConso.set(data.ID,NewMap);
		}
	})
	.on('end', function(){
		resolve(idToConso);
	})
	.on('error', function(error){
		reject(error);
	})
});

var idToAllData = new Map();
Promise.all([getGeoP,getConsoP])
.then(function(results){
	var geo=results[0];
	var conso=results[1];
	geo.forEach(function(geoData,ID){
		idToAllData.set(ID,{
			coords : geoData,
			dateToConso : conso.get(ID)
		});
	});
	console.log(idToAllData.size);
	var finalOutput  = {};
idToAllData.forEach(function(data,ID){
	var dateOutput = [];
	 data.dateToConso.forEach(function(conso,date){
	 	dateOutput.push({
	 		date:date,
	 		conso:conso
	 	});
	})
	finalOutput[ID] = {
		coords:data.coords,
		consoByDate: dateOutput
	};
})

fs.writeFile('./data/allData.json',JSON.stringify(finalOutput));
})
.catch(function(err){
	console.log('error',err);
});


var myJSON = require('./data/allData.json');
var MyGeoJSON = GeoJSON.parse(myJSON, {Point: 'coords'});


var fs = require('fs');

var fichierendur = JSON.stringify(MyGeoJSON); // je convertis mon objetJSON en texte pur pour pouvoir l'écrire dans un fichier

fs.writeFile('MyGeoJSON.geojson', fichierendur );