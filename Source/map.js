import Cesium from 'cesium/Cesium';

import {load3dTiles} from './map/load3dTiles';
import {loadGeojson} from './map/loadGeojson';
import {loadBingImagery} from './map/loadImagery';
import {initInteraction} from './map/interaction';
import {selectedLayersSignal} from './signals';

const layers = [];

function setupTime(viewer) {
	viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date(2017, 10, 16, 9, 0));
	viewer.clock.multiplier = 1;
	viewer.clock.shouldAnimate = true; //if it was paused.

	// Set up clock and timeline.
	// viewer.clock.shouldAnimate = true; // default
	// viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
	// viewer.clock.stopTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:20:00Z");
	// viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
	// viewer.clock.multiplier = 2; // sets a speedup
	// viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; // tick computation mode
	// viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // loop at the end
	// viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime); // set visible range
}

function setupCamera(viewer) {
	// Create an initial camera view
	// var initialPosition = new Cesium.Cartesian3.fromDegrees(
	//     -73.998114468289017509,
	//     40.674512895646692812,
	//     2631.082799425431
	// );
	// var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);

	const initialPosition = new Cesium.Cartesian3.fromDegrees(
		46.0319684578321,
		51.532937475728112,
		1000,
	);

	const initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
		7.1077496389876024807,
		-90,//-31.987223091598949054,
		0.025883251314954971306
	);

	const homeCameraView = {
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
}

function configure(viewer) {
	setupTime(viewer);
	setupCamera(viewer);

	// Cask shadows
	// viewer.shadows = true;

	// Enable lighting based on sun/moon positions
	viewer.scene.globe.enableLighting = true;

	viewer.resolutionScale = window.devicePixelRatio;
}

export function getDefaultViewerOptions() {
	return {
		scene3DOnly: true,
		// selectionIndicator: false,
		// baseLayerPicker: false,
		animation: false,
		timeline: false,
		homeButton: false,
		infoBox: false,
		sceneModePicker: false,
		baseLayerPicker: false,
		fullscreenButton: false,
		selectionIndicator: false,
		navigationHelpButton: false,
		geocoder: false,
	}
}

export function getDefaultConfig() {
	return {
		base: '',
		tiles: [],
	}
}


function loadConfig(url) {
	return fetch(url)
		.then(x => x.json())
		.catch(e => getDefaultConfig());
}

function toggleLayer(type, value) {
	layers
		.filter(layer => layer.type === type)
		.map(layer => layer.data)
		.forEach(data => {
			data.show = value;
		});
}

function onSelectedLayersUpdate(layers) {
	layers.forEach(layer => {
		toggleLayer(layer.type, layer.checked);
	})
}

const LAYER_BUILDINGS = 'buildings';
const LAYER_CONVERT = 'convert';
const LAYER_GREEN = 'green';

const CONTENT_TYPE_3D_TILES = '3d-tiles';
const CONTENT_TYPE_GEOJSON = 'geojson';

function loadData(viewer, options) {
	const {url, styled, type, contentType} = options;
	let promise;
	switch (contentType) {
		case CONTENT_TYPE_3D_TILES: {
			promise = Promise.resolve(
				load3dTiles(viewer, url, styled)
			);
			break;
		}

		case CONTENT_TYPE_GEOJSON: {
			promise = loadGeojson(viewer, url);
			break;
		}
	}

	return promise
		.then(data => ({
			data,
			type,
		}));
}

export function initMap(viewer) {
	configure(viewer);
	loadBingImagery(viewer);
	initInteraction(viewer);

	selectedLayersSignal.on(onSelectedLayersUpdate);

	return loadConfig('/config.json')
		.then(config => {
			const base = config.base || '';
			const dataSource = config.dataSource || [];
			return Promise.all(dataSource
				.map(({url, ...x}) => ({
					...x,
					url: base + url,
				}))
				.map(options => loadData(viewer, options))
			);
		})
		.then(items => {
			items.forEach(x => {
				layers.push(x);
			});
		})
		.then(() => {
			selectedLayersSignal.trigger([
				{name: 'Застройка', type: LAYER_BUILDINGS, checked: true},
				{name: 'Конверты', type: LAYER_CONVERT, checked: false},
				{name: 'Озеленение', type: LAYER_GREEN, checked: false},
			]);
		})

	// viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
	// var inspectorViewModel = viewer.cesium3DTilesInspector.viewModel;
}
