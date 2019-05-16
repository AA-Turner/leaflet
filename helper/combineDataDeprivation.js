function combineDataDeprivationInit () {
  $.when(
    $.getJSON(lsoaJsonFile),
    $.getJSON(imdJsonFile)
  ).done(
    (LSOAjson, IMDarray) => {

      joinTables (
        IMDarray[0],
        LSOAjson[0].features,
        imdObject => {
          return imdObject.lsoaCode; //IMD
        },
        lsoaObject => {
          return lsoaObject.properties.lsoa11cd; //LSOA geoJSON
        },
        (imd, lsoa) => {
          let key; //dummy variable for key-value pairs
          for (key in imd) {
            if (imd.hasOwnProperty(key)) {
              lsoa.properties[key]= imd[key];
            }
          }
          return lsoa;
        }
      );

      //LSOAjson[0].features = results;
      //deprivationOverlay(
      console.log (
        LSOAjson);
    });
}