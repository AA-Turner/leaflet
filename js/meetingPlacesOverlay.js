const combinedDataMeetingPlacesFile = 'data/CYS combined postcodes-sections.json';

function meetingPlacesOverlayInit(){
    meetingPlaces = L.layerGroup()
        .addTo(map);
}

function meetingPlacesOverlay(geoData) {
    for (let i = 0; i < geoData.length; i++) {
        const item = geoData[i].features[0];
        const coords = item.geometry.coordinates;
        const itemDistricts = item.properties.districts;
        let popupContent = '';
        let marker;

        for (let district in itemDistricts) {
            popupContent += `<h3>${district}</h3>`;
            for (let group in  itemDistricts[district].groups){
                popupContent += `<h4 class="groupAlignCentre">${group}</h4>`;
                for (let section in  itemDistricts[district].groups[group].sections){
                    const sectionProps = itemDistricts[district].groups[group].sections[section];
                    popupContent += `
                    <p>
                        <b>
                            ${sectionType(sectionProps.sectionType)}
                        </b>: ${sectionProps.sectionName}<br />
                        <small> Young people (M: ${sectionProps['yp-males']}, F: ${sectionProps['yp-females']}, T: ${sectionProps['yp-total']})</small>
                    </p>`
                }
            }
        }

        marker = new L.marker([coords[1],coords[0]],).bindPopup(popupContent);
        marker.addTo(meetingPlaces);
    }

    function sectionType(type) {
        if (type === "C") { return "Colony"}
        if (type === "P") { return "Pack"}
        if (type === "T") { return "Troop"}
        if (type === "U") { return "Unit"}
        if (type === "Y") { return "YL Unit"}
        if (type === "N") { return "Network"}
    }

}