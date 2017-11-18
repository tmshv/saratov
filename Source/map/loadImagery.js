import Cesium from 'cesium/Cesium';

export function loadBingImagery(viewer) {
	Cesium.BingMapsApi.defaultKey = 'AihaXS6TtE_olKOVdtkMenAMq1L5nDlnU69mRtNisz1vZavr1HhdqGRNkB2Bcqvs'; // For use with this application only

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