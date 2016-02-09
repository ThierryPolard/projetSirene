'use strict';


// var mapboxgl = require('mapbox-gl');
var L = require('react-leaflet');
var token = 'pk.eyJ1IjoiYW50aGlsbCIsImEiOiJUR0FoRGdJIn0.ZygA4KxIt8hJ1LAvPPMHwQ';

var GeoJSON = require('geojson'); //package json write geoJson in the right way
var data = require('./data/allData.json');

var React  = require('react');
var ReactDOM = require ('react-dom');

var Application = require('./Components/Application.js');


data.forEach(function(element){
    var mapByDate = new Map();
        element.paramByDate.forEach(function(item){
           mapByDate.set(item.date,
                         item.param)
        });
    element.paramByDate = mapByDate;
});

var application = React.createElement(Application, {
    data: data
});

ReactDOM.render(application, document.getElementById('reactApp'));