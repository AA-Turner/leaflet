L.GeoJSON.Boundary = L.GeoJSON.extend({
	initialize: function(geojson, options) {
		L.GeoJSON.prototype.initialize.call(this, geojson, options);

		overlayMaps[options.name] = this;
	},
	//TODO implement nested options setting
	/*
	 * Opinionated defaults for a boundary layer
	 */
	options: {
		style: {
			color: "#000",
			weight: 2,
			opacity: 1,
			fill: false
		}
	},
});
L.geoJSON.boundary = function(geojson, options) {
	return new L.GeoJSON.Boundary(geojson, options);
};

L.LayerGroup.Markers = L.LayerGroup.extend({
	initialize: function(layers, options) {
		L.LayerGroup.prototype.initialize.call(this, layers, options);

		overlayMaps[options.name] = this;
	},
	// Takes a GeoJSON features array containing point objects
	// Marker popup content retrieved from popup_details (can be HTML)
	addMarkers: function(features) {
		for (let i = 0; i < features.length; i++) {
			const coordinates = features[i].geometry.coordinates;
			let marker = new L.Marker([coordinates[0], coordinates[1]]); //lat long
			if (features[i].popup_details) {
				marker.bindPopup(features[i].popup_details);
			}
			this.addLayer(marker);
		}
	}
});
L.layerGroup.markers = function(layers, options) {
	return new L.LayerGroup.Markers(layers, options);
};

L.Control.RegionControl = L.Control.extend({
	onAdd: function() {
		//TODO generalise - css class
		this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
		return this._div;
	}
});
L.control.regionControl = function(options) {
	return new L.Control.RegionControl(options);
};

L.GeoJSON.Regions = L.GeoJSON.extend({
	initialize: function(geojson, options) {
		L.GeoJSON.prototype.initialize.call(this, geojson, options);
		let self = this;
		this.controlActive = false;
		this.topLayers = [];
		//Note if specifying properties on instantiation, all properties 2 or more levels down must be specified as I haven't implemented nested options setting yet
		//TODO implement nested options setting
		/*
		 * Opinionated defaults for a region layer
		 */
		let defaultOptions = {
			onEachFeature: function(feature, layer) {
				layer.on({
					mouseover: function(e) {
						self.highlightFeature(e, self);
					},
					mouseout: function(e) {
						self.resetHighlight(e, self);
					}
				});
			}
		};

		L.setOptions(this, L.Util.extend(
			defaultOptions,
			options)
		);

		overlayMaps[options.name] = this;
	},
	activateControl: function() {
		this.controlActive = true;
		this.control = L.control.regionControl().addTo(map);
	},
	addTopLayer: function (topLayer) {
		this.topLayers.push(topLayer);
	},
	controlFunction: function(controlUpdateFunction) {
		this.activateControl();
		this.control.update = controlUpdateFunction;
		this.control.update();
	},
	highlightFeature: function(e, overlay) {
		if (!overlay.topLayers) { overlay.topLayers = []; }
		const object = e.target;
		//TODO generalise
		object.setStyle({
			color: "#999",
			dashArray: 0
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			object.bringToFront();

			overlay.topLayers.forEach(topLayer => {
				topLayer.bringToFront();
			});
		}
		if (overlay.controlActive) {overlay.control.update(object.feature.properties);}
	},
	resetHighlight: function(e, overlay) {
		overlay.resetStyle(e.target);
		if (overlay.controlActive) {overlay.control.update();}
	},
	styleFunctionGenerator: function(refFunction) {
		this.options.style = refFunction;
	},
});
L.geoJSON.regions = function(geojson, options) {
	return new L.GeoJSON.Regions(geojson, options);
};