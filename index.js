'use strict';


// var mapboxgl = require('mapbox-gl');
var L = require('leaflet');
var token = 'pk.eyJ1IjoiYW50aGlsbCIsImEiOiJUR0FoRGdJIn0.ZygA4KxIt8hJ1LAvPPMHwQ';

var GeoJSON = require('geojson'); //package json write geoJson in the right way
var data = require('./data/allData.json')

var map = L.map('map', {
    layers: [
        L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + token, {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        })
    ],
    attributionControl: false,
    center: [44.8397, -0.5730],
    zoom: 12
});

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

console.log('data', data)


var myMap = new Map();
var fakeData = [
            {   id: "Thil",
                coords: ["-0.692218", "44.89419"],
                featureMap : [{"date":"01/01/2014", features: {"oxygene":"4"}},{"date":"01/02/2014",features: {"oxygene":"4"}}]
            },
            {   id: "Reserve",
                coords: ["-0.8", "44.88"],
                featureMap : [{"date":"01/01/2014", features: {"oxygene":"6"}},{"date":"01/02/2014",features: {"oxygene":"4"}}]
            }
         ];


data.forEach(function(element){
    var mapByDate = new Map();
    mapByDate.set(element.date,
                  element.oxygene)
    element.OxygeneByDate = mapByDate;
});

console.log('data', data)


fakeData.forEach(function(element){
    var mapByDate = new Map();
    mapByDate.set(element.date,
                  element.features)
    element.featureMap = mapByDate;
});

console.log('fakeData',fakeData)


//var myLayer = L.geoJson(myMap);
//myLayer.addTo(map); // j'ajoute ma layer à ma map


var MyGeoJSON = GeoJSON.parse(data, {Point: 'coords'});


L.geoJson(MyGeoJSON, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map);
