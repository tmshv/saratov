import {join} from '../lib/fn';
import {isEmptyObject} from "../lib/utils";
import {getAttributes as getAttrs} from "../map";

export class FeatureCollection {
	constructor() {
		this.attributesMap = new Map();
		this.featurePolylines = new Map();
	}

	getAttributes() {
		return this.attributesMap;
	}

	getFeatureAttributes(name) {
		return this.attributesMap.get(name);
	}

	saveAttributes(items) {
		const name = ({systemName}) => systemName;
		items = join(items);
		items.forEach(x => {
			this.attributesMap.set(name(x), x);
		});

		window.saratovAttributes = this.getAttributes();
	}

	addFeaturePolyline(entity) {
		this.featurePolylines.set(entity.name, entity);
	}

	getFeaturePolyline(entity) {
		return this.featurePolylines.get(entity.name);
	}
}

export function getAttributes(item) {
	if (item.id) {
		const a = getGeojsonAttributes(item);
		const attrs = getAttrs();

		return attrs.get(a.name);
	}
	// if (item.content) return get3dTilesAttributes(item);

	return null;
}

export function getGeojsonAttributes(item) {
	const feature = item.id;

	const props = feature.properties;
	// return props.getValue();
	const attributeNames = props.propertyNames;
	return attributeNames.reduce((acc, x) => ({
		...acc,
		[x]: props[x].getValue(),
	}), {});
}

export function get3dTilesAttributes(item) {
	const feature = item.content.getFeature(0);
	const attributeNames = feature.getPropertyNames();
	const attributes = attributeNames.reduce((acc, x) => ({
		...acc,
		[x]: feature.getProperty(x),
	}), {});

	if (isEmptyObject(attributes)) return null;
	return attributes;
}

export function getFeature(item) {
	if (!item) return null;
	if (item.id) return item.id;

	if (!item.content) return null; // item is not 3d tile
	return item.content.getFeature(0);
}

export default new FeatureCollection();
