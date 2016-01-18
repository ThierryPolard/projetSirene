'use strict';

// var mapboxgl = require('mapbox-gl');
var L = require('leaflet');

var token = 'pk.eyJ1IjoiYW50aGlsbCIsImEiOiJUR0FoRGdJIn0.ZygA4KxIt8hJ1LAvPPMHwQ';

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

L.circleMarker([44.84, -0.5742])
.addTo(map);