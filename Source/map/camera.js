import Cesium from 'cesium/Cesium';

class StoredView {
	constructor() {
		this.position = undefined;
		this.direction = undefined;
		this.up = undefined;
		this.right = undefined;
		this.transform = undefined;
		this.frustum = undefined;
	}

	save(camera) {
		this.position = Cesium.Cartesian3.clone(camera.positionWC, this.position);
		this.heading = camera.heading;
		this.picth = camera.pitch;
		this.roll = camera.roll;
		this.transform = Cesium.Matrix4.clone(camera.transform, this.transform);

		return this;
	}

	load(camera) {
		camera.position = Cesium.Cartesian3.clone(this.position, camera.position);
		camera.heading = this.heading;
		camera.pitch = this.pitch;
		camera.roll = this.roll;
		camera.transform = Cesium.Matrix4.clone(this.transform, camera.transform);

		return this;
	}
}

export function setupCamera(viewer) {
	// Create an initial camera view
	// var initialPosition = new Cesium.Cartesian3.fromDegrees(
	//     -73.998114468289017509,
	//     40.674512895646692812,
	//     2631.082799425431
	// );
	// var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);

	setupController(viewer);

	const initialPosition = new Cesium.Cartesian3.fromDegrees(
		46.056233171535396309,
		51.498024692443912897,
		1850,
	);

	const homeCameraView = {
		destination: initialPosition,
		orientation: {
			heading: 5.8598696803362635,
			pitch: -0.4101786746245062,
			roll: 6.281716442987705,
		},
	};

	// Set the initial view
	viewer.scene.camera.setView(homeCameraView);

	// Add some camera flight animation options
	homeCameraView.duration = 2.0;
	homeCameraView.maximumHeight = 2000;
	homeCameraView.pitchAdjustHeight = 2000;
	homeCameraView.endTransform = Cesium.Matrix4.IDENTITY;

	// window.cam = () => {
	// 	const v = new StoredView();
	// 	console.log(v.save(viewer.camera));
	// };
}

function setupController(viewer) {
	const CameraEventType = Cesium.CameraEventType;
	const KeyboardEventModifier = Cesium.KeyboardEventModifier;
	const scene = viewer.scene;

	scene.screenSpaceCameraController.tiltEventTypes = [
		CameraEventType.MIDDLE_DRAG,
		CameraEventType.PINCH,
		{
			eventType: CameraEventType.LEFT_DRAG,
			modifier: KeyboardEventModifier.CTRL
		},
		{
			eventType: CameraEventType.RIGHT_DRAG,
			// modifier: KeyboardEventModifier.CTRL
		},
	];

	scene.screenSpaceCameraController.zoomEventTypes = [
		// CameraEventType.RIGHT_DRAG,
		CameraEventType.WHEEL,
		CameraEventType.PINCH,
	]
}
