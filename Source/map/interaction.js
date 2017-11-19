import Cesium from 'cesium/Cesium';
import {selectedFeatureSignal} from '../signals';

const hoverColor = new Cesium.Color(1, 1, 0, .5); // Yellow
const selectColor = new Cesium.Color(1, 1, 1, .5); // White

export function initInteraction(viewer) {
	// Information about the currently selected feature
	var selected = {
		feature: undefined,
		originalColor: new Cesium.Color()
	};

	// Information about the currently highlighted feature
	var highlighted = {
		feature: undefined,
		originalColor: new Cesium.Color()
	};

	// An entity object which will hold info about the currently selected feature for infobox display
	var selectedEntity = new Cesium.Entity();

	// Color a feature yellow on hover.
	viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
		// If a feature was previously highlighted, undo the highlight
		if (Cesium.defined(highlighted.feature)) {
			highlighted.feature.color = highlighted.originalColor;
			highlighted.feature = undefined;
		}

		// Pick a new feature
		var pickedFeature = viewer.scene.pick(movement.endPosition);
		if (!Cesium.defined(pickedFeature)) {
			// nameOverlay.style.display = 'none';
			return;
		}

		// Highlight the feature if it's not already selected.
		if (pickedFeature !== selected.feature) {
			highlighted.feature = pickedFeature;
			Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
			pickedFeature.color = hoverColor;
		}
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

	// Color a feature on selection and show metadata in the InfoBox.
	// 	var clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
	viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
		// If a feature was previously selected, undo the highlight
		if (Cesium.defined(selected.feature)) {
			selected.feature.color = selected.originalColor;
			selected.feature = undefined;
		}

		// Pick a new feature
		var pickedFeature = viewer.scene.pick(movement.position);
		if (!Cesium.defined(pickedFeature)) {
			// clickHandler(movement);
			// return;
		}

		selectFeature(null);

		// Select the feature if it's not already selected
		if (selected.feature === pickedFeature) {
			return;
		}
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
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function selectFeature(item) {
	if (!item) {
		selectedFeatureSignal.trigger(null);
		return;
	}

	const feature = item.content.getFeature(0)
	const attributeNames = feature.getPropertyNames();
	const attributes = attributeNames.reduce((acc, x) => Object.assign(acc, {
		[x]: feature.getProperty(x),
	}), {});

	selectedFeatureSignal.trigger(attributes);
}
