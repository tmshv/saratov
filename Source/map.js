import {load3dTiles} from './map/load3dTiles';
import {loadGeojson} from './map/loadGeojson';
import {loadBingImagery} from './map/loadImagery';
import {initInteraction} from './map/interaction';

function configure(viewer) {
	//////////////////////////////////////////////////////////////////////////
	// Configuring the Scene
	//////////////////////////////////////////////////////////////////////////

	// Enable lighting based on sun/moon positions
	viewer.scene.globe.enableLighting = true;

	// Create an initial camera view
	// var initialPosition = new Cesium.Cartesian3.fromDegrees(
	//     -73.998114468289017509,
	//     40.674512895646692812,
	//     2631.082799425431
	// );
	// var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);

	var initialPosition = new Cesium.Cartesian3.fromDegrees(
		46.0319684578321,
		51.532937475728112,
		1000,
	);

	var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
		7.1077496389876024807,
		-90,//-31.987223091598949054,
		0.025883251314954971306
	);

	var homeCameraView = {
		destination: initialPosition,
		orientation: {
			heading: initialOrientation.heading,
			pitch: initialOrientation.pitch,
			roll: initialOrientation.roll
		}
	};
	// Set the initial view
	viewer.scene.camera.setView(homeCameraView);

	// Add some camera flight animation options
	homeCameraView.duration = 2.0;
	homeCameraView.maximumHeight = 2000;
	homeCameraView.pitchAdjustHeight = 2000;
	homeCameraView.endTransform = Cesium.Matrix4.IDENTITY;
	// Override the default home button

	viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
		e.cancel = true;
		viewer.scene.camera.flyTo(homeCameraView);
	});

	// Set up clock and timeline.
	// viewer.clock.shouldAnimate = true; // default
	// viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
	// viewer.clock.stopTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:20:00Z");
	// viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
	// viewer.clock.multiplier = 2; // sets a speedup
	// viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; // tick computation mode
	// viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // loop at the end
	// viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime); // set visible range

	return homeCameraView;
}

const rgba = ([r, g, b]) => ({
	red: r / 255,
	green: g / 255,
	blue: b / 255,
	alpha: 1,
});

export function getDefaultViewerOptions() {
	return {
		scene3DOnly: true,
		// selectionIndicator: false,
		// baseLayerPicker: false,
		animation: false,
		timeline: false,
	}
}

export function initMap(viewer) {
	Cesium.BingMapsApi.defaultKey = 'AihaXS6TtE_olKOVdtkMenAMq1L5nDlnU69mRtNisz1vZavr1HhdqGRNkB2Bcqvs'; // For use with this application only

	// viewer.shadows = true;
	viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date(2017, 10, 16, 9, 0));
	viewer.clock.multiplier = 1;
	viewer.clock.shouldAnimate = true; //if it was paused.

	loadBingImagery(viewer);
	// loadOsmImagery(viewer);
	// loadTerrain(viewer);

	const homeCameraView = configure(viewer);

	// initMouseInteraction(viewer);
	// setupCameraModes(viewer);

	// Finally, wait for the initial city to be ready before removing the loading indicator.
	// var loadingIndicator = document.getElementById('loadingIndicator');
	// loadingIndicator.style.display = 'block';
	// city.readyPromise.then(function () {
	// loadingIndicator.style.display = 'none';
	// });

	// load3dTiles(viewer, './Data/Tileset', true);

	// load3dTiles(viewer, './Data/20171116-Susch-Tileset');

	load3dTiles(viewer, './Data/20171117-Define-Sample', true);
	load3dTiles(viewer, './Data/20171117-Define', true);
	load3dTiles(viewer, './Data/20171117-DefineRL');
	load3dTiles(viewer, './Data/20171117-DefineOKN');

	load3dTiles(viewer, './Data/20171117-Neutral', true);
	load3dTiles(viewer, './Data/20171117-NeutralRL');
	load3dTiles(viewer, './Data/20171117-NeutralOKN');

	// loadGeojson(viewer, './Data/Models/green-1.geojson');
	// loadGeojson(viewer, './Data/Models/green-2.geojson');
	// loadGeojson(viewer, './Data/Models/roads.geojson');

	// loadGeojsonAreas(viewer);
	initInteraction(viewer);

	// viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
	// var inspectorViewModel = viewer.cesium3DTilesInspector.viewModel;
}
