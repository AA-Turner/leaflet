function defaults(defaultOptions, userOptions) {
	for (let key in userOptions) {
		if (userOptions.hasOwnProperty(key)) {
			if (typeof (userOptions[key]) !== "undefined") { defaultOptions[key] = userOptions[key]; }}}
	return defaultOptions;}

function choroplethOptions (choroplethOptions, userStyle, values) {
	if (!choroplethOptions) { choroplethOptions = {}; }
	if (!values) { values = [1,2,3,4,5,6,7,8,9,10]; }
	let options = {	valueProperty: 'value',	scale: ['white', 'red'], steps: 5, mode: 'q', bezier: false	};
	options = defaults(options, choroplethOptions);

	const limits = chroma.limits(values, options.mode, options.steps - 1); // Calculate limits
	const colours = ( options.bezier ? // Create color buckets
		chroma.bezier(options.scale).scale().correctLightness().colors(limits.length) :
		chroma.scale(options.scale).colors(limits.length) );
	console.log('chorpleth');

	return function (feature) {
		let style = {};
		let featureValue =  typeof options.valueProperty === 'function' ?
			options.valueProperty(feature) :
			feature.properties[options.valueProperty];

		if (!isNaN(featureValue)) {
			for (let i = 0; i < limits.length; i++) {  // Find the bucket/step/limit that this value is less than and give it that color
				if (featureValue <= limits[i]) {
					style.fillColor = colours[i];
					break }}}

		switch (typeof userStyle) { // Return this style, but include the user-defined style if it was passed
			case 'function': return defaults(style, userStyle(feature));
			case 'object': return defaults(style, userStyle);
			default: return style
		}};}