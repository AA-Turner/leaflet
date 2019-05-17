const initLat = 53.768196;
const initLan = -1.41037;
const initZoom = 11;
const lsoaJsonFile = 'data/CYS LSOA.json';
const imdJsonFile = 'data/CYS IMD.json';
const combinedDataDeprivationFile = 'data/CYS combined LSOA-IMD.json';
let map;
let mapboxTileLayer;
let osmTileLayer;
let deprivationLayer;
let deprivationInfoControl;
let boundaryLayer;
let aldwark;
let meetingPlaces;

function initialise() {
  map = L.map('mapid').setView([initLat, initLan], initZoom);
  let mapboxAttribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>';
  let osmAttribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ';
  mapboxTileLayer = new L.TileLayer(
      'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
      {
        "attribution": mapboxAttribution,
        "maxZoom": 18,
        "id": 'mapbox.streets',
        "accessToken": 'pk.eyJ1IjoiYWRhbXR1cm5lciIsImEiOiJjanZsaDNpM2EweWxoM3lxbXgwOXBhcWlhIn0.HeY-b9fI2VD9UvSPaRgOPQ'
      }).addTo(map);
  osmTileLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        "attribution": osmAttribution,
        "maxZoom": 18,
      }); //don't add to map as OSM is an option but not default. Can select via layer controls.

  console.log('initialise');
  infoControl();          //def: deprivationInfoControl req: none
  boundaryOverlay();          //def: boundaryLayer
  meetingPlacesOverlayInit(); //def: meetingPlaces
  deprivationOverlayInit(); //def: lsoaLayer              req: deprivationInfoControl boundaryLayer
  aldwarkLayer();
  overlayControl();
  loadData();
}

function loadData() {
    $.when(
        $.getJSON(combinedDataDeprivationFile),
        $.getJSON(combinedDataMeetingPlacesFile),
        $.getJSON('data/CYS Boundary Full.json')
    ).done(
        (fetchDeprivation, fetchMeetingPlaces, fetchBoundary) =>
        {
            deprivationOverlay(fetchDeprivation);
            boundaryLayer.addData(fetchBoundary);
            meetingPlacesOverlay(fetchMeetingPlaces[0]); //send actual data, filter out ajax response wrapper
        }
    );
}

function boundaryOverlay() {
  boundaryLayer = L.geoJson(null, { style: style})
      .addTo(map);

  function style() { //parameter feature
    return {
      color: '#000',
      weight: 2,
      opacity: 1,
      fill: false
    };
  }
  //onEachFeature: forEachFeature,
  //function forEachFeature(feature, layer) {  }
}

function aldwarkLayer() {
  aldwark = L.marker([54.052837, -1.289845]).bindPopup('Aldwark Activity Centre')
      .addTo(map);
}

function boundaryTop() {
  boundaryLayer.bringToFront();
}

initialise();