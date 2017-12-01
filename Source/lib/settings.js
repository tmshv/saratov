import {settingsSignal} from '../signals';
import ViewportQuality from '../models/ViewportQuality';

let currentSettings = {};

settingsSignal.on(settings => {
	currentSettings = settings;
});

export function setOptions(partialState) {
	currentSettings = {
		...currentSettings,
		...partialState,
	};

	settingsSignal.trigger(currentSettings);
}

export function setQuality(qualityMode, overrideQuality = null) {
	const quality = overrideQuality
		? overrideQuality
		: ViewportQuality.getCoef(qualityMode);

	setOptions({
		qualityMode,
		quality,
	});
}

export function setDefaults() {
	const devicePixelRatio = window.devicePixelRatio;

	setOptions({
		devicePixelRatio,
		shadows: false,
		enableGlobalLighting: false,
		qualityMode: ViewportQuality.MEDIUM,
		quality: ViewportQuality.getCoef(ViewportQuality.MEDIUM),
	});
}