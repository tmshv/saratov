import Cesium from 'cesium/Cesium';
import {getZoneColor} from '../models/zones';

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

export function loadGeojsonConverts(viewer, url, {alpha, fill}) {
	const geojsonOptions = {
		clampToGround: false,
		strokeWidth: 3,
		// stroke: getColor(null, alpha),
		// fill: getColor(null, alpha),
	};

	// Load neighborhood boundaries from a GeoJson file
	return Cesium.GeoJsonDataSource
		.load(url, geojsonOptions)
		.then(dataSource => {
			dataSource.entities.values.forEach(entity => {
				const geom = entity.polygon
					? entity.polygon
					: entity.polyline;
					// entity.corridor; // corridor if clampToGround enabled

				if (geom) {
					geom.material = fill
						? getColor(fill, alpha)
						: getEntityMaterial(entity, alpha);
					geom.outline = false;
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
