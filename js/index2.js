'use strict';

var L = require('leaflet'); // Appel dU package 'Leaflet '
var token = 'pk.eyJ1IjoiYW50aGlsbCIsImEiOiJUR0FoRGdJIn0.ZygA4KxIt8hJ1LAvPPMHwQ'; // token d'identification mapBox



// Création de la carte en appelant le token d'identification
var map = L.map('map', {
    layers: [
        L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + token, {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        })
    ],
    attributionControl: false,
    center: [44.8397, -0.5730], // Coordonnée du centre de la carte au début de l'affichage
    zoom: 12 // Niveau de zoom par défaut
});

// Ajout de marqueurs ecrit en dur, pour le fun

L.circleMarker([44.84, -0.5742]) // Définition des coord
.addTo(map); // Commande d'ajour à la carte

var circle = L.circle([44.79, -0.5742], 100, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
})
.addTo(map);

// Ajout des marqueurs d'apres les coordonnées données dans le fichier csv

var myGeoJSON = require('./geoData.geojson');
var myLayer = L.geoJson(myGeoJSON);  // je crée une layer de type GeoJSON
myLayer.addTo(map); // j'ajoute ma layer à ma map