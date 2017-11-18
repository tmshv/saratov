import Cesium from 'cesium/Cesium';

export function loadBingImagery(viewer) {
	viewer.imageryLayers.addImageryProvider(new Cesium.BingMapsImageryProvider({
		url: 'https://dev.virtualearth.net',
		mapStyle: Cesium.BingMapsStyle.AERIAL // Can also use Cesium.BingMapsStyle.ROAD
	}));

	return viewer;
}

export function loadOsmImagery(viewer) {
	viewer.imageryLayers.addImageryProvider(Cesium.createOpenStreetMapImageryProvider({
		url: 'https://a.tile.openstreetmap.org/'
	}));

	return viewer;
}