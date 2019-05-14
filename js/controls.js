function overlayControl() {
    // for Layer Control
    const baseMaps = {
        "Mapbox": mapboxLayer
    };

    const overlayMaps = {
        "LSOA": lsoaLayer,
        "Boundary": boundaryLayer,
        "Aldwark marker": aldwark,
        "Meeting Places": meetingPlaces
    };

//Add layer control
    L.control.layers(baseMaps, overlayMaps, {position: 'bottomright'}).addTo(map);
}

function infoControl() {
    deprivationInfoControl = L.control();

    deprivationInfoControl.onAdd = function () {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

// method that we will use to update the control based on feature properties passed
    deprivationInfoControl.update = function (props) {
        this._div.innerHTML = '<h4>IMD Decile <br /> '+
            '(1 = most deprived)</h4>' +  (props ?
                '<b>' + props.lsoaName + '</b><br />' + props.imdDecile
                : 'Hover over a region');
    };

    deprivationInfoControl.addTo(map);
}