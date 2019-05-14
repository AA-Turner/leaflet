function helper(lookupTable, mainTable, lookupKey, mainKey) {
  var l = lookupTable.length; //IMD Data
  var m = mainTable.length;   //LSOA JSON
  var lookupIndex = [];
  var output = [];
  for (var i = 0; i < l; i++) { // loop through l items (length of lookup)
    var row = lookupTable[i];
    lookupIndex[row[lookupKey]] = row; // create an index for lookup table
  }
  for (var j = 0; j < m; j++) { // loop through m items (length of main)
    var y = mainTable[j];
    var x = lookupIndex[y.properties[mainKey]]; // get corresponding row from lookupTable
    var key;
    if (typeof x !== "undefined") {
      for (key in x) {
        if (x.hasOwnProperty(key)) {
          y.properties[key]= x[key];
        }
      }
      output.push(y);
    }
  }
  return output;
}

function joinData (LSOAjson, IMDarray, LSOAkey, IMDkey) {
  console.log (LSOAjson);
  /*console.log (IMDarray);
  console.log ('typeof LSOAkey ' + LSOAkey);
  console.log ('typeof IMDkey ' + IMDkey);*/
  var features = LSOAjson[0].features;

  var results = helper( IMDarray[0], features, IMDkey, LSOAkey);
  console.log('results');
  console.log(results);
  LSOAjson[0].features = results;
  return LSOAjson
}

