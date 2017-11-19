import Cesium from 'cesium/Cesium';

import {load3dTiles} from './map/load3dTiles';
import {loadGeojson, parseGeojsonOptions} from './map/loadGeojson';
import {loadBingImagery} from './map/loadImagery';
import {initInteraction} from './map/interaction';
import {setupCamera} from './map/camera';
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

function configure(viewer) {
	setupTime(viewer);
	setupCamera(viewer);

	// Cask shadows
	// viewer.shadows = true;

	// Enable lighting based on sun/moon positions
	viewer.scene.globe.enableLighting = true;

	viewer.resolutionScale = 1;//window.devicePixelRatio;
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
	// return Promise.resolve([{
	// 	"url": "Data/Models/green-1.geojson",
	// 	"type": "green",
	// 	"contentType": "geojson"
	// }]);
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

function loadData(viewer, params) {
	const {url, styled, type, contentType} = params;
	let promise;
	switch (contentType) {
		case CONTENT_TYPE_3D_TILES: {
			promise = Promise.resolve(
				load3dTiles(viewer, url, styled)
			);
			break;
		}

		case CONTENT_TYPE_GEOJSON: {
			const options = params.options
				? parseGeojsonOptions(params.options)
				: {};
			promise = loadGeojson(viewer, url, options);
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
				{name: 'Застройка', type: LAYER_BUILDINGS, checked: false},
				{name: 'Конверты', type: LAYER_CONVERT, checked: false},
				{name: 'Озеленение', type: LAYER_GREEN, checked: true},
			]);
		})

	// viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
	// var inspectorViewModel = viewer.cesium3DTilesInspector.viewModel;
}
