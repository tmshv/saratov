import Cesium from 'cesium/Cesium';

import {load3dTiles, create3dTilesStyle} from './map/load3dTiles';
import {loadGeojson, parseGeojsonOptions} from './map/loadGeojson';
import {loadBingImagery as loadImagery} from './map/loadImagery';
import {initInteraction} from './map/interaction';
import {setupCamera} from './map/camera';
import {selectedLayersSignal} from './signals';

const layers = [];

function setupTime(viewer) {
	viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2017-06-22T04:00:00Z");
	viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2017-06-22T04:00:00Z");
	// viewer.clock.multiplier = 1;
	// viewer.clock.shouldAnimate = true; //if it was paused.

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

function setupViewer(viewer) {
	// Cask shadows
	// viewer.shadows = true;

	// Enable lighting based on sun/moon positions
	// viewer.scene.globe.enableLighting = true;

	// Setup scale for better retina support
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

function join(lists) {
	return lists.reduce((acc, x) => [...acc, ...x], []);
}

function loadJson(url) {
	return fetch(url)
		.then(x => x.json())
		.catch(e => null);
}

function loadConfig(url) {
	const dataSourceType = 'dataSource';
	return loadJson(url)
		.then(config => {
			const dataSource = config.dataSource
				.filter(x => x.contentType !== dataSourceType);

			const innerConfigUrls = config.dataSource
				.filter(x => x.contentType === dataSourceType)
				.map(x => x.url);
			return Promise.all(innerConfigUrls.map(loadJson))
				.then(innerConfigs => {
					const inner = join(innerConfigs
						.map(x => x.dataSource)
					);
					return {
						...config,
						dataSource: [
							...dataSource,
							...inner,
						]
					};
				})
		})
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
			const style = styled
				? create3dTilesStyle(type)
				: null;
			promise = Promise.resolve(
				load3dTiles(viewer, url, style)
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
	setupViewer(viewer);
	setupTime(viewer);
	setupCamera(viewer);
	loadImagery(viewer);
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
				{name: 'Существующая застройка', type: LAYER_BUILDINGS, checked: false},
				{name: 'Пространственные конверты', type: LAYER_CONVERT, checked: true},
				{name: 'Участки озеленения', type: LAYER_GREEN, checked: false},
			]);
		})

	// viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
	// var inspectorViewModel = viewer.cesium3DTilesInspector.viewModel;
}
