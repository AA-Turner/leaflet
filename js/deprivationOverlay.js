function deprivationOverlay(geoData) {
    // Null variable that will hold layer
    deprivationLayer = L.choropleth
    (geoData, {
        valueProperty: 'imdDecile', // function (feature) { return feature.properties.imdDecile }
        scale: ['red', 'white'],
        steps: 10,
        mode: 'q',
        onEachFeature: forEachFeature,
        style: {
            fillOpacity: 0.65, //fill
            weight: 1, //stroke
            opacity: 1,//stroke
            color: 'white',//stroke
            dashArray: '2'//stroke
        }
    }).addTo(map);

    boundaryTop();

    overlayControl();
}

function forEachFeature(feature, layer) {

    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
    });
}

function highlightFeature(e) {
    const object = e.target;

    object.setStyle({
        weight: 3,
        color: '#999',
        dashArray: 0
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        object.bringToFront();
        boundaryTop();
    }

    deprivationInfoControl.update(object.feature.properties);
}

function resetHighlight(e) {
    deprivationLayer.resetStyle(e.target);
    e.target.bringToBack();
    deprivationInfoControl.update();
}

function usePreCombinedData() {
    $.getJSON(combinedDataDeprivationFile, function (data) {
        deprivationOverlay(data);
    });
}

function deprivationOverlayInit() {
    //combineDatasets();
    usePreCombinedData();
}