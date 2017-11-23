import Cesium from 'cesium/Cesium';
import {zones} from '../models/zones';

export function create3dTilesStyle(type) {
	if (type === 'green') {
		return new Cesium.Cesium3DTileStyle({
			color: color('#00b26b', 0.7),
			show: true,
		});
	}

	const zone = attrEqual.bind(null, 'systemZone');

	return new Cesium.Cesium3DTileStyle({
		color: {
			conditions: [
				...zones.map(x => [
					zone(x.zoneName), color(x.color, 1)
				]),

				['true', color('#FFFFFF', 1.0)]
			]
		},
		show: true,
	});
}

function createDefault3dTilesStyle() {
	return new Cesium.Cesium3DTileStyle({
		color: color('#ffffff', 1.0),
		show: true,
	});
}

function color(hex, alpha) {
	return `color('${hex}', ${alpha})`;
}

function attrEqual(attribute, value){
	return `\${${attribute}} === '${value}'`;
}

export function load3dTiles(viewer, url, style) {
	const tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
		url,
		maximumScreenSpaceError: 16, // default value

		// debugColorizeTiles: true,
		// debugShowBoundingVolume: true,
		// debugShowContentBoundingVolume: true,
		// debugShowUrl: true,
		// debugWireframe: true,
	}));

	if (style) tileset.style = style;
	else tileset.style = createDefault3dTilesStyle();

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
