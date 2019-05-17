function deprivationOverlay(geoData) {
    // Null variable that will hold layer
    deprivationLayer.addData(geoData);

    boundaryTop();
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

function deprivationOverlayInit() {
    let options = choroplethOptions (
        {
            valueProperty: 'imdDecile', // function (feature) { return feature.properties.imdDecile }
            scale: ['red', 'deeppink', 'lightyellow'], //['#ca0020', '#eca88a', '#c3b5b0', '#9ac3d7','#0571b0'] fillOpacity: 0.4, weight: 0.2,color: 'black', dashArray: 0
            bezier: true,
            steps: 10,
            mode: 'q',
            onEachFeature: forEachFeature,
            style: {
                fillOpacity: 0.8, //fill
                weight: 1, //stroke
                color: 'white',//stroke
                dashArray: 2 //stroke
            }
        }, [1,2,3,4,5,6,7,8,9,10]
    );

    deprivationLayer = new L.GeoJSON(null, options)
        .addTo(map);

    //combineDatasets();
}