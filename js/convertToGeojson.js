'use strict'
module.exports  = { 
var fs = require('fs'); //natif node system file read and write in file
var parse = require('csv-parse'); //read line by line csv file
var geojson = require('geojson'); //package json write geoJson in the right way

var input = fs.createReadStream('/allData.json'); //open stream to file


var geoData = [];

input.pipe(parser)
.on('data', function(data){
	geoData.push(data);
})
.on('end', function(){
	console.log('end');
	var datajson = geojson.parse(geoData, {Point: ['lat', 'lon'], include: ['ID']});
	fs.writeFile('/datageo.json', JSON.stringify(datajson));
})
.on('error', function(){
	console.log('error');
})


}