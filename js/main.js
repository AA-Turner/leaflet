const initLat = 53.768196;
const initLon = -1.41037;
const initZoom = 11;
const combinedDataDeprivationFile = "data/deprivation_min.json";
const combinedDataMeetingPlacesFile = "data/meeting_places_min.json";
let map;
let mapboxTileLayer;
let osmTileLayer;
let overlayMaps = {};

function overlayControl() {
	const baseMaps = {
		Mapbox: mapboxTileLayer,
		"Open Street Map": osmTileLayer
	};

	//Add layer control
	L.control.layers(baseMaps, overlayMaps, { position: "bottomright" }).addTo(map);
}

function initialise() {
	map = L.map("mapid").setView([initLat, initLon], initZoom);
	let mapboxAttribution =
		'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>';
	let osmAttribution =
		'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors ' +
	'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ';
	mapboxTileLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
		{attribution: mapboxAttribution,
			maxZoom: 18,
			id: "mapbox.streets",
			accessToken:"pk.eyJ1IjoiYWRhbXR1cm5lciIsImEiOiJjanZsaDNpM2EweWxoM3lxbXgwOXBhcWlhIn0.HeY-b9fI2VD9UvSPaRgOPQ"}
	).addTo(map);
	osmTileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
		{attribution: osmAttribution,
			maxZoom: 18}
	); //don't .addTo(map) as OSM is an option but not default. Can select via layer controls.

	console.log("initialise");

	initLayers ();
	overlayControl();
	loadData();
}

function loadData() {
	$.when(
		$.getJSON(combinedDataDeprivationFile),
		$.getJSON(combinedDataMeetingPlacesFile),
		$.getJSON("data/CYS Boundary Full.json")
	).done((fetchDeprivation, fetchMeetingPlaces, fetchBoundary) => {
		deprivationLayer.addData(fetchDeprivation);
		cysBoundaryLayer.addData(fetchBoundary);
		meetingPlacesLayer.addMarkers(fetchMeetingPlaces[0].features); //send actual data, filter out ajax response wrapper
		aldwarkMarkerLayer.addMarkers([{type: "feature",geometry: {type: "Point",coordinates: [54.052837, -1.289845]},popup_details: "Aldwark Activity Centre"}]);
		cysBoundaryLayer.bringToFront();
	});
}

initialise();