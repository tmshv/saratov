import Cesium from 'cesium/Cesium';

import {load3dTiles} from './map/load3dTiles';
import {loadGeojson, loadGeojsonConverts, loadGeojsonPublicSpaces, parseGeojsonOptions} from './map/loadGeojson';
import {loadImagery} from './map/loadImagery';
// import {loadOsmImagery as loadImagery} from './map/loadImagery'
import {initInteraction} from './map/interaction';
import {setupCamera} from './map/camera';
import {setOptions, setDefaults, setQuality} from './lib/settings';
import {selectedLayersSignal, settingsSignal} from './signals';
import ViewportQuality from './models/ViewportQuality';
import featureCollection from './models/features';
import {join} from "./lib/fn";
import {loadGltf} from './map/model';

const layers = [];

function getConfig(config) {
    const defaultConfig = {
        time: '2017-12-22T12:00:00Z',
        shadowsDarkness: 0.7,
    }

    return {
        ...defaultConfig,
        ...config,
        camera: {
            ...getCameraConfig(config),
        },
    }
}

function getCameraConfig(config) {
    const camera = {
        duration: 2.0,
        maximumHeight: 2000,
        pitchAdjustHeight: 2000,
        position: [
            46.056233171535396309,
            51.498024692443912897,
            1850,
        ],
        orientation: {
            heading: 5.8598696803362635,
            pitch: -0.4101786746245062,
            roll: 6.281716442987705,
        }
    }

    return {
        ...camera,
        ...config.camera,
    }
}

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

function setupShadows(viewer, {shadowsDarkness = 0.4}) {
	const shadowMap = viewer.shadowMap
	shadowMap.darkness = shadowsDarkness
}

function setupTime(viewer, {time = "2017-06-22T012:00:00Z"}) {
	const date = Cesium.JulianDate.fromIso8601(time)
	viewer.clock.startTime = date
	viewer.clock.currentTime = date
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
					const innerDataSources = join(innerConfigs
						.map(x => x.dataSource)
					);
					const innerConfig = innerConfigs
						.reduce((acc, x) => ({
							...acc,
							...x,
						}), {})
					return {
						...config,
						...innerConfig,
						dataSource: [
							...dataSource,
							...innerDataSources,
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

const TYPE_BUILDINGS = 'buildings';
const TYPE_CONVERT = 'convert';
const TYPE_PUBLIC_SPACE = 'publicSpace';

const CONTENT_TYPE_3D_TILES = '3d-tiles';
const CONTENT_TYPE_GEOJSON = 'geojson';
const CONTENT_TYPE_GLTF = 'gltf';
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
			if (type === TYPE_CONVERT) {
				promise = loadGeojsonConverts(viewer, url, params);
			} else if (type === TYPE_PUBLIC_SPACE) {
				promise = loadGeojsonPublicSpaces(viewer, url, params);
			} else {
				promise = loadGeojson(viewer, url, parseGeojsonOptions(params));
			}
			break;
		}

		case CONTENT_TYPE_ATTRIBUTES: {
			promise = loadJson(url);
			break;
		}

		case CONTENT_TYPE_GLTF: {
			promise = loadGltf(viewer, url, params.options);
			break;
		}
	}

	return !promise
		? null
		: promise
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
	setupGlobals(viewer)
	selectedLayersSignal.on(onSelectedLayersUpdate)

	return loadConfig('/config.json')
        .then(getConfig)
		.then(config => {
			console.log('Using config:', config)

			applyConfig(viewer, config)

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
				{name: 'Существующая застройка', type: TYPE_BUILDINGS, checked: true},
				{name: 'Пространственные конверты', type: TYPE_CONVERT, checked: true},
				{name: 'Участки озеленения', type: TYPE_PUBLIC_SPACE, checked: true},
			]);
		})

	// viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
	// var inspectorViewModel = viewer.cesium3DTilesInspector.viewModel;
}

function applyConfig(viewer, config) {
	setupApp(viewer)
	setupTime(viewer, config)
	setupShadows(viewer, config)
    setupCamera(viewer, config)
	setupAdaptiveQuality(viewer)
	loadImagery(viewer, config)
	initInteraction(viewer)
}

function setupGlobals(viewer) {
	window.viewer = viewer
	window.Cesium = Cesium
}