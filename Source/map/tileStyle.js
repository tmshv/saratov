import Cesium from 'cesium/Cesium';
import {zones, getZoneColor} from '../models/zones';
import {ZONE_PUBLIC_SPACE} from '../models/zones';

const zone = attrEqual.bind(null, 'systemZone');
const attrName = attrEqual.bind(null, 'systemName');

export function createPublicSpacesStyle() {
	const hex = getZoneColor(ZONE_PUBLIC_SPACE, '#ffffff');

	return new Cesium.Cesium3DTileStyle({
		color: color(hex, 0.7),
		show: true,
	});
}

export function createConvertStyle(name) {
	return new Cesium.Cesium3DTileStyle({
		color: {
			conditions: [
				...zones.map(x => [
					zone(x.zoneName), color(x.color, 0.5)
				]),

				['true', color('#FFFFFF', 1.0)]
			]
		},
		show: name
			? attrName(name)
			: false,
	});
}

export function createDefault3dTilesStyle() {
	return new Cesium.Cesium3DTileStyle({
		color: color('#ffffff', 1.0),
		show: true,
	});
}

function color(hex, alpha) {
	return `color('${hex}', ${alpha})`;
}

function attrEqual(attribute, value) {
	return `\${${attribute}} === '${value}'`;
}
