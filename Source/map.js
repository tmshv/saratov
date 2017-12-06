import Cesium from 'cesium/Cesium';

import {load3dTiles} from './map/load3dTiles';
import {loadGeojson, loadGeojsonConverts, parseGeojsonOptions} from './map/loadGeojson';
import {loadBingImagery as loadImagery} from './map/loadImagery';
import {initInteraction} from './map/interaction';
import {setupCamera} from './map/camera';
import {setOptions, setDefaults, setQuality} from './lib/settings';
import {selectedLayersSignal, settingsSignal} from './signals';
import ViewportQuality from './models/ViewportQuality';
import featureCollection from './models/features';
import {join} from "./lib/fn";

const layers = [];

function setupApp(viewer) {
	settingsSignal.on(settings => {
		// Cask shadows
		viewer.shadows = settings.shadows;

		// Enable lighting based on sun/moon positions
		viewer.scene.globe.enableLighting = settings.enableGlobalLighting;

		// Setup scale for better retina support
		const quality = settings.quality;
		const devicePixelRatio = settings.devicePixelRatio;
		viewer.resolutionScale = devicePixelRatio * quality;
	});
}

function setupAdaptiveQuality(viewer) {
	let isAdaptive = false;
	let userSettings = null;

	settingsSignal.on(settings => {
		const {qualityMode, adaptiveWorks} = settings;
		if (qualityMode === ViewportQuality.ADAPTIVE && !isAdaptive) {
			isAdaptive = true;

			saveUserSettings(settings);
			enableAdaptive();
			setTimeout(setHigh, 0);
		} else if (qualityMode !== ViewportQuality.ADAPTIVE && isAdaptive) {
			isAdaptive = false;
			disableAdaptive();
		}

		if (qualityMode === ViewportQuality.ADAPTIVE && !adaptiveWorks) {
			saveUserSettings(settings);
		}
	});

	function saveUserSettings(settings) {
		userSettings = {
			shadows: settings.shadows,
		};
	}

	const setLow = () => {
		setOptions({
			quality: ViewportQuality.getCoef(ViewportQuality.LOW),
			shadows: false,
			adaptiveWorks: true,
		});
	};

	const setHigh = () => {
		setOptions({
			...userSettings,
			quality: ViewportQuality.getCoef(ViewportQuality.HIGH),
			adaptiveWorks: false,
		});
	};

	const camera = viewer.scene.camera;

	function enableAdaptive() {
		camera.moveStart.addEventListener(setLow);
		camera.moveEnd.addEventListener(setHigh);
	}

	function disableAdaptive() {
		camera.moveStart.removeEventListener(setLow);
		camera.moveEnd.removeEventListener(setHigh);

		setOptions(userSettings);
	}
}

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
		.catch(e => {
			console.error(e);
			return getDefaultConfig();
		});
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
const LAYER_GREEN = 'publicSpaces';

const CONTENT_TYPE_3D_TILES = '3d-tiles';
const CONTENT_TYPE_GEOJSON = 'geojson';
const CONTENT_TYPE_ATTRIBUTES = 'attributes';

function loadData(viewer, params) {
	const {url, type, contentType} = params;
	let promise;
	switch (contentType) {
		case CONTENT_TYPE_3D_TILES: {
			promise = Promise.resolve(
				load3dTiles(viewer, url, type)
			);
			break;
		}

		case CONTENT_TYPE_GEOJSON: {
			const options = params.options
				? parseGeojsonOptions(params.options)
				: {};
			promise = type === 'convert'
				? loadGeojsonConverts(viewer, url, params)
				: loadGeojson(viewer, url, options);
			break;
		}

		case CONTENT_TYPE_ATTRIBUTES: {
			promise = loadJson(url);
			break;
		}

		default: {
			return null;
		}
	}

	return promise
		.then(data => ({
			data,
			type,
			contentType,
		}));
}

export function getAttributes() {
	return featureCollection.getAttributes();
}

export function initMap(viewer) {
	setupApp(viewer);
	setupTime(viewer);
	setupCamera(viewer);
	setupAdaptiveQuality(viewer);
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
			return items.filter(Boolean);
		})
		.then(items => {
			const attributes = items.filter(x => x.contentType === CONTENT_TYPE_ATTRIBUTES);
			featureCollection.saveAttributes(attributes.map(x => x.data));

			return items.filter(x => x.contentType !== CONTENT_TYPE_ATTRIBUTES);
		})
		.then(items => {
			items.forEach(x => {
				layers.push(x);
			});
		})
		.then(() => {
			selectedLayersSignal.trigger([
				{name: 'Существующая застройка', type: LAYER_BUILDINGS, checked: true},
				{name: 'Пространственные конверты', type: LAYER_CONVERT, checked: true},
				{name: 'Участки озеленения', type: LAYER_GREEN, checked: true},
			]);
		})

	// viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
	// var inspectorViewModel = viewer.cesium3DTilesInspector.viewModel;
}
