import Cesium from 'cesium/Cesium';

export function loadGltf(viewer, url, {longitude, latitude, altitude, scale}) {
	const scene = viewer.scene;

	const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude);
	const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);

	const model =  scene.primitives.add(Cesium.Model.fromGltf({
		url,
		modelMatrix,
		scale,
	}));

	return Promise.resolve(model);
}

