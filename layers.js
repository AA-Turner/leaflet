let aldwarkMarkerLayer;
let cysBoundaryLayer;
let meetingPlacesLayer;
let deprivationLayer;
function initLayers (){
	aldwarkMarkerLayer = L.layerGroup.markers(null, {"name": "Aldwark Marker"}).addTo(map);
	cysBoundaryLayer = L.geoJSON.boundary(null, {"name": "CYS Boundary"}).addTo(map);
	meetingPlacesLayer = L.layerGroup.markers(null, {"name": "Meeting Places"}).addTo(map);
	deprivationLayer = L.geoJSON.regions(null, {"choropleth": {"bezier": false, "valueProperty": "imdDecile", "scale": ["white", "blue"], "mode": "e", "steps": 10}, "name": "Deprivation"}).addTo(map);

	deprivationLayer.controlFunction(function(props) {
		this._div.innerHTML = "<h4>IMD Decile<br />(where 1 is most deprived)</h4>" +
			(props
				? `<table><tr><th>Name:</th><td>${props.lsoaName}</td></tr>
                    <tr><th>IMD Decile:</th><td>${props.imdDecile}</td></tr></table>`
				: "<div><strong>No region selected</strong><br />Hover over a region</div>");
	});
	deprivationLayer.styleFunctionGenerator(choroplethOptions(
		{
			valueProperty: "imdDecile",
			scale: ["red", "deeppink", "lightyellow"], //['#ca0020', '#eca88a', '#c3b5b0', '#9ac3d7','#0571b0'] fillOpacity: 0.4, weight: 0.2,color: 'black', dashArray: 0
			bezier: true,
			steps: 10,
			mode: "e"
		},
		{
			fillOpacity: 0.8,
			weight: 1,
			color: "white",
			dashArray: 2
		},
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	));
	deprivationLayer.addTopLayer(cysBoundaryLayer);
}
