function joinTables(indexTable, secondTable, primaryKeyFunction, foreignKeyFunction, matchFunction) {
    const l = indexTable.length;    //should have unique values for the index column
    const m = secondTable.length;   //second table with a column of matching values (not necessarily unique or 1 to 1)
    const lookupIndex = [];
    const output = []; /***** OUTPUT *****/
    for (var i = 0; i < l; i++) { // loop through l items (length of lookup)
        const indexObject = indexTable[i]; //gets the object at row i
        const lookupIndexKey = primaryKeyFunction(indexObject);
        lookupIndex[lookupIndexKey] = indexObject; //creates an entry in the lookup table with specific value of lookupKey from
        // object row. SW1A 0AA => Object for Palace of Westminster
    }
    for (var j = 0; j < m; j++) { // loop through m items (length of main)
        const y = secondTable[j]; //
        const mainIndexKey = foreignKeyFunction(y);
        const x = lookupIndex[mainIndexKey]; // get corresponding row from indexTable

        if (typeof x !== "undefined") {
            output.push(matchFunction (x, y)); /***** OUTPUT *****/
        }
    }
    return output; //does it need to return output?? /***** OUTPUT *****/
}