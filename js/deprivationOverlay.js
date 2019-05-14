function deprivationOverlay(geoData) {
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
        /*let popupContent = "<p>LSOA code: <b>" + feature.properties.lsoa11nm + "</b><br />" +
            "LSOA decile: <b>" + feature.properties.imdDecile + "</b></p>" ;
        layer.bindPopup(popupContent);*/

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

        deprivationInfoControl.update(layer.feature.properties);
    }

    function resetHighlight(e) {
        lsoaLayer.resetStyle(e.target);
        e.target.bringToBack();
        deprivationInfoControl.update();
    }

    function getColor(d) {
        if (d < 2) { return '#800026'; } else
        if (d < 3) { return '#BD0026'; } else
        if (d < 4) { return '#E31A1C'; } else
        if (d < 5) { return '#FC4E2A'; } else
        if (d < 6) { return '#FD8D3C'; } else
        if (d < 7) { return '#FEB24C'; } else
        if (d < 8) { return '#FED976'; } else
        if (d < 9) { return '#FFEDA0'; } else
        if (d < 10){ return '#FFFDCB'; }
        else return '#FFFEEC';
    }
    boundaryTop();
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