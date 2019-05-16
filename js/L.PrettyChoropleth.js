function defaults(defaultOptions, userOptions) {
	for (var key in userOptions) {
		if (userOptions.hasOwnProperty(key)) {
			if (typeof (userOptions[key]) !== "undefined") { defaultOptions[key] = userOptions[key]; }
		}}
	return defaultOptions;
}

function extend (object, source) {
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			if (typeof (source[key]) !== "undefined") { object[key] = source[key]; }
		}}
	return object;
}

function choroplethOptions (userOptions, values) {
	let userStyle = userOptions.style;
	if (!userOptions) { userOptions = {}; }

	let options = {
		valueProperty: 'value',
		scale: ['white', 'red'],
		steps: 5,
		mode: 'q'
	};

	options = defaults(options, userOptions);

	// Calculate limits
	/*let values = geojson.features.map(
		typeof options.valueProperty === 'function' ?
			options.valueProperty :
			item => { return item.properties[options.valueProperty] });*/

	let limits = chroma.limits(values, options.mode, options.steps - 1);
	// Create color buckets
	let colours = (options.colours && options.colours.length === limits.length ?
		options.colours :
		chroma.bezier(options.scale).scale().correctLightness().colors(limits.length));

	extend (options, {
		limits: limits,
		colours: colours,
		style: function (feature) {
			let style = {};
			let featureValue;

			if (typeof options.valueProperty === 'function') {
				featureValue = options.valueProperty(feature)
			} else {
				featureValue = feature.properties[options.valueProperty]
			}

			if (!isNaN(featureValue)) {
				// Find the bucket/step/limit that this value is less than and give it that color
				for (let i = 0; i < limits.length; i++) {
					if (featureValue <= limits[i]) {
						style.fillColor = colours[i];
						break
					}
				}
			}

			// Return this style, but include the user-defined style if it was passed
			switch (typeof userStyle) {
				case 'function':
					return defaults(style, userStyle(feature));
				case 'object':
					return defaults(style, userStyle);
				default:
					return style
			}
		}
	});
	return options
}