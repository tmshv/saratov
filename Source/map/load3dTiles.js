import Cesium from 'cesium/Cesium';

function color(hex, alpha) {
	return `color('${hex}', ${alpha})`;
}

function attrEqual(attribute, value){
	return `\${${attribute}} === '${value}'`;
}

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
		const layerName = attrEqual.bind(null, 'layer_name');

		tileset.style = new Cesium.Cesium3DTileStyle({
			color: {
				conditions: [
					[layerName('history_type0'), color('#d12121', 1)],
					[layerName('history_type2'), color('#ff6619', 1)],
					[layerName('history_type3'), color('#ff73b3', 1)],
					[layerName('history_type4'), color('#ffc9e6', 1)],
					[layerName('transformed_type2'), color('#004dff', 1)],
					[layerName('transformed_type3'), color('#75bfff', 1)],
					[layerName('transformed_type4'), color('#bae8ff', 1)],

					['true', color('#FFFFFF', 1.0)]
				]
			},
			show: true,
		});
	}

	// Adjust the tileset height so it's not floating above terrain
	// var heightOffset = -32;
	const heightOffset = 0;
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

	tileset.show = false;
	return tileset;
}
