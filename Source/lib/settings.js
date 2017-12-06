import {settingsSignal} from '../signals';
import ViewportQuality from '../models/ViewportQuality';

let currentSettings = {};

settingsSignal.on(settings => {
	currentSettings = settings;
});

export function getSettings() {
	return {
		...currentSettings,
	}
}

export function setOptions(partialState) {
	const settings = {
		...currentSettings,
		...partialState,
	};

	settingsSignal.trigger(settings);
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
		blurredBackground: true,
		shadows: false,
		enableGlobalLighting: false,
		qualityMode: ViewportQuality.ADAPTIVE,
		quality: ViewportQuality.getCoef(ViewportQuality.ADAPTIVE),
	});
}