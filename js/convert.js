'use strict'

// Conversion en GeoJSON

var fs = require('fs'); //natif node system file read and write in file
var parse = require('csv-parse'); //read line by line csv file
var geojson = require('geojson'); //package json write geoJson in the right way
var path = require('path'); //

var myJSON = require('./allData.json');


geojson.parse(myJSON, {Point: 'coords'}); // 
//fs.writeFile('./geoData.geojson', myJSON); // l'écrire en geojson

//Var geoData = JSON.stringify(myJSON); //  le convertir en texte