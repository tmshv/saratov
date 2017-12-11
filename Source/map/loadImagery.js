import Cesium from 'cesium/Cesium';

export function loadBingImagery(viewer) {
	Cesium.BingMapsApi.defaultKey = 'AihaXS6TtE_olKOVdtkMenAMq1L5nDlnU69mRtNisz1vZavr1HhdqGRNkB2Bcqvs'; // For use with this application only

	const provider = new Cesium.BingMapsImageryProvider({
		url: 'https://dev.virtualearth.net',
		mapStyle: Cesium.BingMapsStyle.AERIAL // Can also use Cesium.BingMapsStyle.ROAD
	});
	provider.defaultContrast = 1.5;
	viewer.imageryLayers.addImageryProvider(provider);

	return viewer;
}

export function loadOsmImagery(viewer) {
	viewer.imageryLayers.addImageryProvider(Cesium.createOpenStreetMapImageryProvider({
		url: 'https://a.tile.openstreetmap.org/'
	}));

	return viewer;
}

export function loadMapBoxImagery(viewer) {
	// viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
	// 	mapId: 'mapbox.streets',
	// 	//Get your Mapbox API Access Token here: http://mapbox.com
	// 	accessToken: 'pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNqNTVpYW1jbDBlNHYycXVnbTJrNTUwazUifQ.DF85c-omTlwEApu2NJKf7w',
	// 	credit: 'Mapbox, OpenStreetMap Contributors'
	// }));

	// https://api.mapbox.com/styles/v1/streettracking/cja9xt5hu1xrz2snw0a11l3m6.html?fresh=true&title=true&access_token=pk.eyJ1Ijoic3RyZWV0dHJhY2tpbmciLCJhIjoiY2phOXh5MXF6MGlmODJ3bndjOHZ4b2l5eiJ9.lWlwwq6yf7yhtSWPVEhxMg
	viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
		// mapId: 'streettracking',
		// mapId: 'cja9xt5hu1xrz2snw0a11l3m6',
		// mapId: 'streettracking',
		mapId: 'mapbox.streets-satellite',
		accessToken: 'pk.eyJ1Ijoic3RyZWV0dHJhY2tpbmciLCJhIjoiY2phOXh5MXF6MGlmODJ3bndjOHZ4b2l5eiJ9.lWlwwq6yf7yhtSWPVEhxMg'
	}));

	return viewer;
}