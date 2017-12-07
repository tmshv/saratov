/**
 * EPSG:3857 CRS -> EPSG:4326 WSG84
 */
export function project3857to4326(x, y) {
	const R = 6378137;
	const d = 180 / Math.PI;
	const lat = (2 * Math.atan(Math.exp(y / R)) - (Math.PI / 2)) * d;
	const lon = (x * d / R);

	return {lat, lon};
}