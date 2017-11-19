import Cesium from 'cesium/Cesium';

function createColor(hex, alpha) {
	console.log('CC', hex, alpha);
	const color = Cesium.Color.fromCssColorString(hex);
	color.alpha = alpha;
	return color;
}

export function parseGeojsonOptions({
										fill = '#ffffff',
										fillOpacity = 1,
										stroke = '#ffffff',
										strokeOpacity = 1,
										...options
									}) {
	return {
		...options,
		fill: createColor(fill, fillOpacity),
		stroke: createColor(stroke, strokeOpacity),
		// stroke: options.stroke === null
		// 	? null
		// 	: Cesium.Color.fromCssColorString(stroke),
	}
}

export function loadGeojson(viewer, url, options) {
	const geojsonOptions = {
		clampToGround: false,
		// fill: Cesium.Color.WHITE,
		// stroke: new Cesium.Color(1, 0, 1, 1),
		// fill: Cesium.Color.fromCssColorString('#00b26b'),
		// stroke: Cesium.Color.PINK,
		...options,
	};

	// Load neighborhood boundaries from a GeoJson file
	return Cesium.GeoJsonDataSource
		.load(url, geojsonOptions)
		.then(dataSource => {
			viewer.dataSources.add(dataSource);

			dataSource.show = false;
			return dataSource;
		});
}
