'use strict'

var fs = require('fs'); //natif node system file read and write in file
var parse = require('csv-parse'); //read line by line csv file
var GeoJSON = require('geojson'); //package json write geoJson in the right way
var path = require('path'); //
var parser2 = parse({delimiter: ';', columns: true});


var myJSON = require('../data/allData2.json');

var geoData = GeoJSON.parse(myJSON, {Point: 'coords'});

/////////////////////////

GeoJSON.parse(data, {Point: ['lat', 'lng']});