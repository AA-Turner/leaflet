function initInfoControl() {
    deprivationInfoControl = L.control();
    infoControl();
}

function overlayControl() {
    // for Layer Control
    const baseMaps = {
        "Mapbox": mapboxTileLayer,
        "Open Street Map": osmTileLayer
    };

    const overlayMaps = {
        "Deprivation": deprivationLayer,
        "Boundary": boundaryLayer,
        "Aldwark marker": aldwark,
        "Meeting Places": meetingPlaces
    };

//Add layer control
    L.control.layers(baseMaps, overlayMaps, {position: 'bottomright'}).addTo(map);
}

function infoControl() {
    deprivationInfoControl.onAdd = function () {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

// method that we will use to update the control based on feature properties passed
    deprivationInfoControl.update = function (props) {
        this._div.innerHTML =
            `<h4>IMD Decile<br />(where 1 is most deprived)</h4>
             ${ props ?
                `<table><tr><th>Name:</th><td>${props.lsoaName}</td></tr>
                 <tr><th>IMD Decile:</th><td>${props.imdDecile}</td></tr></table>` :
                '<div><strong>No region selected</strong><br />Hover over a region</div>'
                }`;
    };
    deprivationInfoControl.addTo(map);

}