const postcodeGeoJSONFile = 'CYS Postcodes.json';
const sectionJSONFile = 'CYS Sections.json';
let postcodeGeoJSON;
let combinedSectionJSON;

function importJSONData() {
  $.when(
    $.getJSON(postcodeGeoJSONFile), //ajaxPostcode
    $.getJSON(sectionJSONFile)      //ajaxSection
  ).done( (postcode, section) => {
    postcodeGeoJSON = postcode; //because of import geocode

    combinedSectionJSON = joinTables(
      postcodeGeoJSON[0],
      section[0],
      postcodeObject => {
        return postcodeObject.features[0].properties.postcode;
      },
      meetingPlaceObject => {
        return meetingPlaceObject.postcode;
      },
      combineDataHelper);
    console.log(combinedSectionJSON);
    console.log(postcodeGeoJSON);     //these two should be identical
  });
}

function combineDataHelper(postcodeObject, sectionObject){
  let key; //dummy variable for key-value pairs
  let props = postcodeObject.features[0].properties;
  var currentDistrict = sectionObject.district;
  var currentGroup = sectionObject.group;
  var currentSectionName = sectionObject.sectionName;
  if (typeof props.districts === "undefined")                                                                     { props.districts = {}; }
  if (typeof props.districts[currentDistrict] === "undefined")                                                    { props.districts[currentDistrict] = {}; }
  if (typeof props.districts[currentDistrict].groups === "undefined")                                             { props.districts[currentDistrict].groups = {}; }
  if (typeof props.districts[currentDistrict].groups[currentGroup] === "undefined")                               { props.districts[currentDistrict].groups[currentGroup] = {}; }
  if (typeof props.districts[currentDistrict].groups[currentGroup].sections === "undefined")                      { props.districts[currentDistrict].groups[currentGroup].sections = {}; }
  if (typeof props.districts[currentDistrict].groups[currentGroup].sections[currentSectionName] === "undefined")  { props.districts[currentDistrict].groups[currentGroup].sections[currentSectionName] = {}; }
  let propsSection = props.districts[currentDistrict].groups[currentGroup].sections[currentSectionName];

  /*
  if (typeof props[currentDistrict] === "undefined")                                    { props[currentDistrict] = new Object(); }
  if (typeof props[currentDistrict][currentGroup] === "undefined")                      { props[currentDistrict][currentGroup] = new Object(); }
  if (typeof props[currentDistrict][currentGroup][currentSectionName] === "undefined")  { props[currentDistrict][currentGroup][currentSectionName] = new Object(); }
  propsSection = props[currentDistrict][currentGroup][currentSectionName];    */

  for (key in sectionObject) {
    if (sectionObject.hasOwnProperty(key)) {
      propsSection[key]= sectionObject[key];
    }
  }
  return postcodeObject;
}