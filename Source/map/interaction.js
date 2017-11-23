import Cesium from 'cesium/Cesium';
import {selectedFeatureSignal} from '../signals';
import {isEmptyObject} from "../lib/utils";

const hoverColor = new Cesium.Color(1, 1, 1, .5); // White
const selectColor = new Cesium.Color(1, 1, 1, .45); // White

export function initInteraction(viewer) {
	viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

	initFeatureSelection(viewer);
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
		if (!pickedFeature) return;

		if(!canSelectFeature(pickedFeature)) return;

		// Highlight the feature if it's not already selected.
		if (pickedFeature !== selected.feature) {
			highlighted.feature = pickedFeature;
			Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
			pickedFeature.color = hoverColor;
		}
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
		setCamera(viewer, pickedFeature);
	};

	viewer.screenSpaceEventHandler.setInputAction(onMouseMove, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	viewer.screenSpaceEventHandler.setInputAction(onLeftClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function unselectFeature() {
	selectedFeatureSignal.trigger(null);
}

function selectFeature(item) {
	if (!item.content) return null; // item is not 3d tile

	const feature = item.content.getFeature(0);
	const attributeNames = feature.getPropertyNames();
	const attributes = attributeNames.reduce((acc, x) => ({
		...acc,
		[x]: feature.getProperty(x),
	}), {});

	if (isEmptyObject(attributes)) return null;

	console.log('Select:', attributes);
	selectedFeatureSignal.trigger(attributes);
	return attributes;
}

function getFeature(item) {
	if (!item.content) return null; // item is not 3d tile
	return item.content.getFeature(0);
}

function canSelectFeature(item) {
	if (!item.content) return false; // item is not 3d tile

	const feature = item.content.getFeature(0);
	const attributeNames = feature.getPropertyNames();
	const attributes = attributeNames.reduce((acc, x) => ({
		...acc,
		[x]: feature.getProperty(x),
	}), {});

	return !isEmptyObject(attributes);
}

function setCamera(viewer, item) {
	const feature = getFeature(item);
	console.log(item, feature, feature.primitive.boundingSphere);
	// Position tileset
	// const boundingSphere = tileset.boundingSphere;
	// const cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
	// const surfacePosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
	// const offsetPosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
	// const translation = Cesium.Cartesian3.subtract(offsetPosition, surfacePosition, new Cesium.Cartesian3());
	// tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
}
