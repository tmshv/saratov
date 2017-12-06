import Cesium from 'cesium/Cesium';
import {createDefault3dTilesStyle, createConvertStyle, createPublicSpacesStyle} from './tileStyle';
import {selectedFeatureSignal} from "../signals/index";

function color(hex, alpha) {
	return `color('${hex}', ${alpha})`;
}

export function load3dTiles(viewer, url, type) {
	if (type === 'convert') return loadConverts(viewer, url);
	if (type === 'publicSpaces') return loadPublicSpaces(viewer, url);

	const tileset = createTileset(viewer, url);
	tileset.style = createDefault3dTilesStyle();

	setupHeightPosition(tileset);

	tileset.show = false;
	return tileset;
}

function createTileset(viewer, url) {
	return viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
		url,
		maximumScreenSpaceError: 16, // default value

		// debugColorizeTiles: true,
		// debugShowBoundingVolume: true,
		// debugShowContentBoundingVolume: true,
		// debugShowUrl: true,
		// debugWireframe: true,
	}));
}


export function loadConverts(viewer, url) {
	const tileset = createTileset(viewer, url);
	tileset.style = createConvertStyle();

	setupHeightPosition(tileset);
	initTilesetVisibilityBySelection(tileset);

	tileset.show = false;
	return tileset;
}

export function loadPublicSpaces(viewer, url) {
	const tileset = createTileset(viewer, url);
	tileset.style = createPublicSpacesStyle();

	setupHeightPosition(tileset);

	return tileset;
}

/**
 * Adjust the tileset height so it's not floating above terrain
 *
 * @param tileset
 * @returns {*}
 */
function setupHeightPosition(tileset) {
	const heightOffset = 0;
	tileset.readyPromise
		.then(tileset => {
			// Position tileset
			const boundingSphere = tileset.boundingSphere;
			const cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
			const surfacePosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
			const offsetPosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
			const translation = Cesium.Cartesian3.subtract(offsetPosition, surfacePosition, new Cesium.Cartesian3());
			tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
		});
	return tileset;
}

function initTilesetVisibilityBySelection(tileset) {
	let currentName = null;

	selectedFeatureSignal.on(attributes => {
		currentName = attributes
			? attributes.name
			: null;

		if (currentName) {
			tileset.show = true;
			tileset.style = createConvertStyle(currentName);
		} else {
			tileset.show = false;
		}
	});

	// tileset.show = false;
}