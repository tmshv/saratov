import Cesium from 'cesium/Cesium';
import {selectedFeatureSignal} from '../signals';

const hoverColor = new Cesium.Color(1, 1, 0, .5); // Yellow
const selectColor = new Cesium.Color(1, 1, 1, .5); // White

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
		selectFeature(pickedFeature);
	};

	viewer.screenSpaceEventHandler.setInputAction(onMouseMove, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	viewer.screenSpaceEventHandler.setInputAction(onLeftClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function unselectFeature() {
	selectedFeatureSignal.trigger(null);
}

function selectFeature(item) {
	if(!item.content) return; // item is not 3d tile

	const feature = item.content.getFeature(0);
	const attributeNames = feature.getPropertyNames();
	const attributes = attributeNames.reduce((acc, x) => ({
		...acc,
		[x]: feature.getProperty(x),
	}), {});

	selectedFeatureSignal.trigger(attributes);
}
