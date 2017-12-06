import Cesium from 'cesium/Cesium';
import {selectedFeatureSignal, highlightFeatureSignal} from '../signals';
import {flyCameraTo} from './camera';
import {getAttributes, getFeature} from '../models/features';
import featureCollection from "../models/features";

const Cesium3DTileFeature = Cesium.Cesium3DTileFeature;

const hoverColor = new Cesium.Color(1, 1, 1, .5); // White
const selectColor = new Cesium.Color(1, 1, 1, .45); // White

export function initInteraction(viewer) {
	viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

	initFeatureSelection(viewer);
	initPolylineHighlighting();

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

function initPolylineHighlighting() {
	let highlighted;

	highlightFeatureSignal.on(feature => {
		if (highlighted) highlighted.show = false;
		if (!feature) return;

		const entity = featureCollection.getFeaturePolyline(feature);

		if (entity) {
			highlighted = entity;
			entity.show = true;
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

export function canSelectFeature(feature) {
	if (!feature) return false;
	if (feature instanceof Cesium3DTileFeature) return false;
	else return true;
}
