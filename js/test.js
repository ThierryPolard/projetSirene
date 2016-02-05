'use strict'


var fs = require('fs'); //natif node system file read and write in file
var parse = require('csv-parse'); //read line by line csv file
var GeoJSON = require('geojson'); //package json write geoJson in the right way

var parser = parse({delimiter: ';', columns: true}); //


var input = fs.createReadStream('../data/sites.csv'); //open stream to file

//var MygeoJSON = GeoJSON.parse(data, {Point: ['lng', 'lat']});

