import Cesium from 'cesium/Cesium';
import {getZoneColor} from '../models/zones';
import featureCollection from '../models/features';

function createColor(hex, alpha) {
	console.log('CC', hex, alpha);
	const color = Cesium.Color.fromCssColorString(hex);
	color.alpha = alpha;
	return color;
}

export function parseGeojsonOptions({
										fill = '#ffffff',
										fillOpacity = 1,
										stroke = '#ffffff',
										strokeOpacity = 1,
										...options
									}) {
	return {
		...options,
		fill: createColor(fill, fillOpacity),
		stroke: createColor(stroke, strokeOpacity),
		// stroke: options.stroke === null
		// 	? null
		// 	: Cesium.Color.fromCssColorString(stroke),
	}
}

export function loadGeojson(viewer, url, options) {
	const geojsonOptions = {
		clampToGround: false,
		// fill: Cesium.Color.WHITE,
		// stroke: new Cesium.Color(1, 0, 1, 1),
		// fill: Cesium.Color.fromCssColorString('#00b26b'),
		// stroke: Cesium.Color.PINK,
		...options,
	};

	// Load neighborhood boundaries from a GeoJson file
	return Cesium.GeoJsonDataSource
		.load(url, geojsonOptions)
		.then(dataSource => {
			viewer.dataSources.add(dataSource);

			dataSource.show = false;
			return dataSource;
		});
}

function getColor(hex, alpha) {
	const color = Cesium.Color.fromCssColorString(hex);
	color.alpha = alpha;
	return color;
}

function getEntityMaterial(entity, alpha) {
	const type = entity.properties.zone.getValue();

	const hex = getZoneColor(type, '#ff00ff');
	return getColor(hex, alpha);
}

function getEntityArea(entity) {
	const area = entity.properties.S_lot.getValue();
	return parseFloat(area);
}

function getStripeMaterial(entity) {
	const type = entity.properties.zone.getValue();
	const hex = getZoneColor(type, '#ff00ff');

	const area = getEntityArea(entity);
	const repeat = Math.round(area / 500);

	return new Cesium.StripeMaterialProperty({
		evenColor: getColor(hex, 1),
		oddColor: getColor(hex, 0),
		repeat,
	});
}

function getGeojsonConvertsMaterial(entity, {alpha, fill, pattern}) {
	if (fill) {
		return getColor(fill, alpha);
	}

	// if (pattern === 'stripe'){
	// 	material = getStripeMaterial(entity);
	// }

	return getEntityMaterial(entity, alpha);
}

export function loadGeojsonConverts(viewer, url, options) {
	const geojsonOptions = {
		clampToGround: false,
		strokeWidth: 2,
		// stroke: getColor(null, alpha),
		// fill: getColor(null, alpha),
	};

	// Load neighborhood boundaries from a GeoJson file
	return Cesium.GeoJsonDataSource
		.load(url, geojsonOptions)
		.then(dataSource => {
			dataSource.entities.values.forEach(entity => {
				let isZone;
				let geom;

				if (entity.polygon) {
					geom = entity.polygon;
					isZone = true;
				} else if (entity.polyline) {
					geom = entity.polyline;
					isZone = false;
				} else {
					return;
				}

				geom.material = getGeojsonConvertsMaterial(entity, options);
				geom.outline = false;

				if (!isZone) {
					featureCollection.addFeaturePolyline(entity);
					entity.show = false;
				}
			});

			return dataSource;
		})
		.then(dataSource => {
			viewer.dataSources.add(dataSource);

			dataSource.show = false;
			return dataSource;
		});
}
