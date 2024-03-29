import Cesium from 'cesium/Cesium';

export function loadTerrain(viewer) {
	// Load STK World Terrain
	viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
		url: 'https://assets.agi.com/stk-terrain/world',
		requestWaterMask: true, // required for water effects
		requestVertexNormals: false // required for terrain lighting
	});
	// Enable depth testing so things behind the terrain disappear.
	viewer.scene.globe.depthTestAgainstTerrain = true;
}
