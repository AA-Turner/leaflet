const initLat = 53.768196;
const initLan = -1.41037;
const initZoom = 11;
const lsoaJsonFile = 'data/CYS LSOA.json';
const imdJsonFile = 'data/CYS IMD.json';
const combinedDataDeprivationFile = 'data/CYS combined LSOA-IMD.json';
let map;
let mapboxLayer;
let lsoaLayer;
let deprivationInfoControl;
let boundaryLayer;
let aldwark;
let meetingPlaces;

function initialise() {
  map = L.map('mapid').setView([initLat, initLan], initZoom);
  mapboxLayer = new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,'+
      ' Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiYWRhbXR1cm5lciIsImEiOiJjanZsaDNpM2EweWxoM3lxbXgwOXBhcWlhIn0.HeY-b9fI2VD9UvSPaRgOPQ'
  }).addTo(map);
  console.log('initialise');
  sectionOverlayInit();
  deprivationOverlayInit();
  boundaryOverlay();
  aldwarkLayer();
}

function boundaryOverlay() {
  boundaryLayer = L.geoJson(null, {onEachFeature: forEachFeature, style: style});
  $.getJSON('data/CYS Boundary Full.json', function (data) {
    boundaryLayer.addData(data);
    boundaryLayer.addTo(map);
  });

  function style(feature) {
    return {
      color: '#000',
      weight: 2,
      opacity: 1,
      fill: false
    };
  }

  function forEachFeature(feature, layer) {  }
}

function aldwarkLayer() {
  aldwark = L.marker([54.052837, -1.289845]).bindPopup('Aldwark Activity Centre');
  aldwark.addTo(map);
}

function boundaryTop() {
  boundaryLayer.bringToFront();
}

initialise();