export function loadGeojson(viewer, url) {
	var geojsonOptions = {
		clampToGround: true,
		// strokeWidth: 2,
		// stroke: Cesium.Color.WHITE,
		// stroke: Cesium.Color.WHITE,
		// fill: new Cesium.Color(rgba([157, 176, 146])),
	};

	// Load neighborhood boundaries from a GeoJson file
	return Cesium.GeoJsonDataSource
		.load(url, geojsonOptions)
		.then(function (dataSource) {
			viewer.dataSources.add(dataSource);

			// Get the array of entities
			return dataSource.entities.values
				.map(entity => {
					if (Cesium.defined(entity.polygon)) {

						// Set the polygon material to a random, translucent color
						// entity.polygon.material = new Cesium.Color(rgba([157, 176, 146]));
						// entity.polygon.outline = false;
						// entity.polygon.outlineColor = new Cesium.Color(0.0, 0.0, 0.0, 1.0);
						// entity.polygon.outlineWidth = 1;

						// entity.stroke = Cesium.Color.HOTPINK;
					}
				})
		});
}
