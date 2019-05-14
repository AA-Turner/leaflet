const postcodeGeoJSONFile = 'CYS Postcodes.json';
const sectionJSONFile = 'CYS Sections.json';
let postcodeGeoJSON;
let sectionJSON;
let combinedSectionJSON;
function importJSONData() {
    let ajaxPostcode = $.getJSON(postcodeGeoJSONFile,);
    let ajaxSection = $.getJSON(sectionJSONFile);
    $.when(ajaxPostcode,ajaxSection).done(function (postcode, section) {
        postcodeGeoJSON = postcode;
        sectionJSON = section;
        combinedSectionJSON = groupOverlayJoinHelper(postcodeGeoJSON[0], sectionJSON[0], 'postcode','postcode' );
        afterCombination();
    });
}


function afterCombination ()
{
    console.log(combinedSectionJSON);
}

function groupOverlayJoinHelper(lookupTable, mainTable, lookupKey, mainKey) {
    const l = lookupTable.length; ////should have unique values for the index column
    const m = mainTable.length;   //LSOA JSON
    const lookupIndex = [];
    const output = [];
    for (var i = 0; i < l; i++) { // loop through l items (length of lookup)
        //console.log('lookupTable');
        //console.log(lookupTable);
        const lookupObject = lookupTable[i]; //gets the object at row i
        //console.log('lookupObject');
        //console.log(lookupObject);
        const lookupIndexKey = lookupObject.features[0].properties[lookupKey];
        lookupIndex[lookupIndexKey] = lookupObject; //creates an entry in the lookup table with specific value of lookupKey from
        // object row. SW1A 0AA => Object for Palace of Westminster
    }
    for (var j = 0; j < m; j++) { // loop through m items (length of main)
        const sectionObject = mainTable[j]; //
        const postcodeObject = lookupIndex[sectionObject[mainKey]]; // get corresponding row from lookupTable
        let key; //dummy variable for key-value pairs

        if (typeof postcodeObject !== "undefined") {
            let props = postcodeObject.features[0].properties;
            var currentDistrict = sectionObject.district;
            var currentGroup = sectionObject.group;
            var currentSectionName = sectionObject.sectionName;
            if (typeof props.districts === "undefined")                                                                     { props.districts = new Object(); }
            if (typeof props.districts[currentDistrict] === "undefined")                                                    { props.districts[currentDistrict] = new Object(); }
            if (typeof props.districts[currentDistrict].groups === "undefined")                                             { props.districts[currentDistrict].groups = new Object(); }
            if (typeof props.districts[currentDistrict].groups[currentGroup] === "undefined")                               { props.districts[currentDistrict].groups[currentGroup] = new Object(); }
            if (typeof props.districts[currentDistrict].groups[currentGroup].sections === "undefined")                      { props.districts[currentDistrict].groups[currentGroup].sections = new Object(); }
            if (typeof props.districts[currentDistrict].groups[currentGroup].sections[currentSectionName] === "undefined")  { props.districts[currentDistrict].groups[currentGroup].sections[currentSectionName] = new Object(); }
            propsSection = props.districts[currentDistrict].groups[currentGroup].sections[currentSectionName];
            for (key in sectionObject) {
                if (sectionObject.hasOwnProperty(key)) {
                    propsSection[key]= sectionObject[key];
                }
            }
            output.push(postcodeObject);
        }
    }
    return output;
}
