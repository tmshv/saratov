import Cesium from 'cesium/Cesium';
import {zoomSignal, settingsSignal} from '../signals';

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
		this.pitch = camera.pitch;
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

export function setupCamera(viewer, {camera}) {
	createCameraDebugTool(viewer);

    const {position, orientation, duration, maximumHeight, pitchAdjustHeight} = camera
    const initialPosition = new Cesium.Cartesian3.fromDegrees(...position)

	const homeCameraView = {
		destination: initialPosition,
        orientation,
    }

	// Set the initial view
    viewer.scene.camera.setView(homeCameraView)

	// Add some camera flight animation options
    homeCameraView.duration = duration
    homeCameraView.maximumHeight = maximumHeight
    homeCameraView.pitchAdjustHeight = pitchAdjustHeight
    homeCameraView.endTransform = Cesium.Matrix4.IDENTITY

	zoomSignal.on(value => {
		if (value > 0) {
            viewer.camera.zoomIn(value)
		} else {
            viewer.camera.zoomOut(Math.abs(value))
        }
    })

	settingsSignal.on(({rotateWithClick}) => {
		if (rotateWithClick) {
            setupControllerForMobile(viewer)
		} else {
            setupControllerForDesktop(viewer)
        }
    })
}

export function flyCameraTo(viewer, {lon, lat, alt}) {
	const camera = viewer.camera;
	const position = Cesium.Cartesian3.fromDegrees(lon, lat, alt);

	const heading = camera.heading;
	const pitch = camera.pitch;
	const roll = camera.roll;

	const boundingSphere = new Cesium.BoundingSphere(position, 150);
	camera.flyToBoundingSphere(boundingSphere, {
		duration: 1000 / 1000,
		offset: {
			heading,
			pitch,
			roll,
		},
	});
}

function getFrameSize(viewer) {
	const canvas = viewer.scene.canvas;
	return {
		width: canvas.width,
		height: canvas.height,
	}
}

function createCameraDebugTool(viewer) {
	window.cam = () => {
		const v = new StoredView();
		console.log(v.save(viewer.camera));
	};
	window.saratov = viewer;
}

function setupControllerForDesktop(viewer) {
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

function setupControllerForMobile(viewer) {
	const CameraEventType = Cesium.CameraEventType;
	const KeyboardEventModifier = Cesium.KeyboardEventModifier;
	const scene = viewer.scene;

	scene.screenSpaceCameraController.tiltEventTypes = [
		CameraEventType.MIDDLE_DRAG,
		CameraEventType.PINCH,
		{
			eventType: CameraEventType.LEFT_DRAG,
		},
		{
			eventType: CameraEventType.RIGHT_DRAG,
			modifier: KeyboardEventModifier.CTRL
		},
	];

	scene.screenSpaceCameraController.zoomEventTypes = [
		// CameraEventType.RIGHT_DRAG,
		CameraEventType.WHEEL,
		CameraEventType.PINCH,
	]
}
