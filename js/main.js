const initLat = 53.768196;
const initLan = -1.41037;
const initZoom = 11;
const lsoaJsonFile = 'LSOA-CYS.json';
const imdJsonFile = 'IMDcys.json';
const combinedJsonFile = 'lsoa-with-imd.json';
let map;
let mapboxLayer;
let lsoaLayer;
let infoLayer;
let boundaryLayer;
let aldwark;

function initialise() {
  map = L.map('mapid').setView([initLat, initLan], initZoom);
  mapboxLayer = new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,'+
      ' Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiYWRhbXR1cm5lciIsImEiOiJjanZsaDNpM2EweWxoM3lxbXgwOXBhcWlhIn0.HeY-b9fI2VD9UvSPaRgOPQ'
  }).addTo(map);
  console.log('initialise')
  //combineDatasets();
  usePreCombinedData();
  boundaryOverlay();
  aldwarkLayer();
}

function combineDatasets () {
  let ajaxLsoa = $.getJSON(lsoaJsonFile,);
  let ajaxIMD = $.getJSON(imdJsonFile);
  $.when(ajaxLsoa,ajaxIMD).done(function (lsoa, imd) {
    lsoaOverlay(
        joinData(lsoa, imd, "lsoa11cd", "lsoaCode")
    );
  });
}

function usePreCombinedData() {
  $.getJSON(combinedJsonFile, function (data) {
    lsoaOverlay(data);
  });
}

function boundaryOverlay() {
  boundaryLayer = L.geoJson(null, {onEachFeature: forEachFeature, style: style});
  $.getJSON('Central Yorkshire All.json', function (data) {
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

function lsoaOverlay(geoData) {
  // Null variable that will hold layer
  lsoaLayer = L.geoJson(null, {onEachFeature: forEachFeature, style: style});
  lsoaLayer.addData(geoData);
  lsoaLayer.addTo(map);
  overlayControl();
  infoControl();
  function style(feature) {
    return {
      fillColor: getColor(feature.properties.imdDecile),
      fillOpacity: 0.65,
      weight: 0.5,
      opacity: 1,
      color: 'white',
      dashArray: '2',
    };
  }

  function forEachFeature(feature, layer) {
    let popupContent = "<p>LSOA code: <b>" + feature.properties.lsoa11nm + "</b><br />" +
      "LSOA decile: " + feature.properties.imdDecile + "<br />" + '#' + feature.properties.imdDecile + '0ffff' +

      "</b></p>" ;
    layer.bindPopup(popupContent);

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  }

  function highlightFeature(e) {
    const layer = e.target;

    layer.setStyle({
      weight: 3,
      color: '#666',
      dashArray: '',
      fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    infoLayer.update(layer.feature.properties);
  }

  function resetHighlight(e) {
    lsoaLayer.resetStyle(e.target);
    e.target.bringToBack();
    infoLayer.update();
  }

  function getColor(d) {
    return d < 2 ? '#800026' :
           d < 3 ? '#BD0026' :
           d < 4 ? '#E31A1C' :
           d < 5 ? '#FC4E2A' :
           d < 6 ? '#FD8D3C' :
           d < 7 ? '#FEB24C' :
           d < 8 ? '#FED976' :
           d < 9 ? '#FFEDA0' :
           d < 10? '#FFFDCB' :
                   '#FFFEEC' ;
  }
  boundaryTop();
}

function overlayControl() {
  // for Layer Control
  const baseMaps = {
    "Mapbox": mapboxLayer
  };

  const overlayMaps = {
    "LSOA": lsoaLayer,
    "Boundary": boundaryLayer,
    "Aldwark marker": aldwark
  };

//Add layer control
  L.control.layers(baseMaps, overlayMaps, {position: 'bottomright'}).addTo(map);
}

function infoControl() {
  infoLayer = L.control();

  infoLayer.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
  };

// method that we will use to update the control based on feature properties passed
  infoLayer.update = function (props) {
    this._div.innerHTML = '<h4>IMD Decile <br /> '+
      '(1 = most deprived)</h4>' +  (props ?
      '<b>' + props.lsoaName + '</b><br />' + props.imdDecile
      : 'Hover over a region');
  };

  infoLayer.addTo(map);
}

function aldwarkLayer() {
  aldwark = L.marker([54.052837, -1.289845]).bindPopup('Aldwark Activity Centre');
  aldwark.addTo(map);
}

function boundaryTop() {
  boundaryLayer.bringToFront();
}

initialise();

