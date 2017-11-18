export function load3dTiles(viewer, url, useStyle = false) {
	const tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
		url,
		maximumScreenSpaceError: 16, // default value

		// debugColorizeTiles: true,
		// debugShowBoundingVolume: true,
		// debugShowContentBoundingVolume: true,
		// debugShowUrl: true,
		// debugWireframe: true,
	}));

	if (useStyle) {
		tileset.style = new Cesium.Cesium3DTileStyle({
			color: {
				conditions: [
					["${layer_name} === 'history_type0'", "color('#d12121', 1)"],
					["${layer_name} === 'history_type2'", "color('#ff6619', 1)"],
					["${layer_name} === 'history_type3'", "color('#ff73b3', 1)"],
					["${layer_name} === 'history_type4'", "color('#ffc9e6', 1)"],
					["${layer_name} === 'transformed_type2'", "color('#004dff', 1)"],
					["${layer_name} === 'transformed_type3'", "color('#75bfff', 1)"],
					["${layer_name} === 'transformed_type4'", "color('#bae8ff', 1)"],

					["true", "color('#FFFFFF', 1.0)"]
				]
			},
			show: true,
		});
	}

	// {
	// 	"show" : "${Area} > 0",
	// 	"color" : {
	// 	"conditions" : [
	// 		["${Height} < 60", "color('#13293D')"],
	// 		["${Height} < 120", "color('#1B98E0')"],
	// 		["true", "color('#E8F1F2', 0.5)"]
	// 	]
	// }
	// }

	// Adjust the tileset height so it's not floating above terrain
	// var heightOffset = -32;
	var heightOffset = 0;
	tileset.readyPromise
		.then(function (tileset) {
			// Position tileset
			const boundingSphere = tileset.boundingSphere;
			const cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
			const surfacePosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
			const offsetPosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
			const translation = Cesium.Cartesian3.subtract(offsetPosition, surfacePosition, new Cesium.Cartesian3());
			tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

			// pickedFeature.color = Cesium.Color.YELLOW;
		});

	return viewer;
}
