import Cesium from 'cesium/Cesium';
import {selectedFeatureSignal, highlightFeatureSignal} from '../signals';
import {flyCameraTo} from './camera';
import {isEmptyObject} from "../lib/utils";
import {getAttributes as getAttrs} from "../map";

const Cesium3DTileFeature = Cesium.Cesium3DTileFeature;

const hoverColor = new Cesium.Color(1, 1, 1, .5); // White
const selectColor = new Cesium.Color(1, 1, 1, .45); // White

export function initInteraction(viewer) {
	viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

	initFeatureSelection(viewer);

	selectedFeatureSignal.on(attributes => {
		if (!attributes) return;

		const {systemCentroid} = attributes;
		if (systemCentroid) {
			const centroid = {
				...systemCentroid,
				alt: 100,
			};
			flyCameraTo(viewer, centroid);
		}
	});
}

function initFeatureSelection(viewer) {
	// Information about the currently selected feature
	const selected = {
		feature: undefined,
		originalColor: new Cesium.Color()
	};

	// Information about the currently highlighted feature
	const highlighted = {
		feature: undefined,
		originalColor: new Cesium.Color()
	};

	const onMouseMove = movement => {
		// If a feature was previously highlighted, undo the highlight
		if (highlighted.feature) {
			highlighted.feature.color = highlighted.originalColor;
			highlighted.feature = undefined;
		}

		// Pick a new feature
		const pickedFeature = viewer.scene.pick(movement.endPosition);

		// Highlight the feature if it's not already selected.
		// if (pickedFeature !== selected.feature) {
		// 	highlighted.feature = pickedFeature;
		// 	Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
		// 	pickedFeature.color = hoverColor;
		// }

		highlightFeature(pickedFeature);
	};

	const onLeftClick = movement => {
		// If a feature was previously selected, undo the highlight
		if (selected.feature) {
			selected.feature.color = selected.originalColor;
			selected.feature = undefined;
		}

		// Pick a new feature
		const pickedFeature = viewer.scene.pick(movement.position);
		if (!pickedFeature) {
			unselectFeature();
			return;
		}

		const attributes = selectFeature(pickedFeature);
		if (!attributes) return;

		// Select the feature if it's not already selected
		if (selected.feature === pickedFeature) return;
		selected.feature = pickedFeature;

		// Save the selected feature's original color
		if (pickedFeature === highlighted.feature) {
			Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
			highlighted.feature = undefined;
		} else {
			Cesium.Color.clone(pickedFeature.color, selected.originalColor);
		}

		// Highlight newly selected feature
		pickedFeature.color = selectColor;
	};

	viewer.screenSpaceEventHandler.setInputAction(onMouseMove, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	viewer.screenSpaceEventHandler.setInputAction(onLeftClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function unselectFeature() {
	selectedFeatureSignal.trigger(null);
}

function selectFeature(item) {
	const attributes = getAttributes(item);
	if (!attributes) return null;

	console.log('Select:', attributes);

	selectedFeatureSignal.trigger(attributes);
	return attributes;
}

function highlightFeature(item) {
	const feature = getFeature(item);
	highlightFeatureSignal.trigger(feature);
}

function getAttributes(item) {
	if (item.id) {
		const a = getGeojsonAttributes(item);
		const attrs = getAttrs();

		return attrs.get(a.name);
	}
	// if (item.content) return get3dTilesAttributes(item);

	return null;
}

function getGeojsonAttributes(item) {
	const feature = item.id;

	const props = feature.properties;
	// return props.getValue();
	const attributeNames = props.propertyNames;
	return attributeNames.reduce((acc, x) => ({
		...acc,
		[x]: props[x].getValue(),
	}), {});
}

function get3dTilesAttributes(item) {
	const feature = item.content.getFeature(0);
	const attributeNames = feature.getPropertyNames();
	const attributes = attributeNames.reduce((acc, x) => ({
		...acc,
		[x]: feature.getProperty(x),
	}), {});

	if (isEmptyObject(attributes)) return null;
	return attributes;
}

function getFeature(item) {
	if (!item) return null;
	if (item.id) return item.id;

	if (!item.content) return null; // item is not 3d tile
	return item.content.getFeature(0);
}

export function canSelectFeature(feature) {
	if (!feature) return false;
	if (feature instanceof Cesium3DTileFeature) return false;
	else return true;
}
