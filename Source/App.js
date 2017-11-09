function loadImagery(viewer) {
	//////////////////////////////////////////////////////////////////////////
	// Loading Imagery
	//////////////////////////////////////////////////////////////////////////

	// Add Bing imagery
	viewer.imageryLayers.addImageryProvider(new Cesium.BingMapsImageryProvider({
		url: 'https://dev.virtualearth.net',
		mapStyle: Cesium.BingMapsStyle.AERIAL // Can also use Cesium.BingMapsStyle.ROAD
	}));
}

function loadTerrain(viewer) {
	//////////////////////////////////////////////////////////////////////////
	// Loading Terrain
	//////////////////////////////////////////////////////////////////////////

	// Load STK World Terrain
	viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
		url: 'https://assets.agi.com/stk-terrain/world',
		requestWaterMask: true, // required for water effects
		requestVertexNormals: false // required for terrain lighting
	});
	// Enable depth testing so things behind the terrain disappear.
	viewer.scene.globe.depthTestAgainstTerrain = true;
}

function configure(viewer) {
	//////////////////////////////////////////////////////////////////////////
	// Configuring the Scene
	//////////////////////////////////////////////////////////////////////////

	// Enable lighting based on sun/moon positions
	// viewer.scene.globe.enableLighting = true;

	// Create an initial camera view
	// var initialPosition = new Cesium.Cartesian3.fromDegrees(
	//     -73.998114468289017509,
	//     40.674512895646692812,
	//     2631.082799425431
	// );
	// var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);

	var initialPosition = new Cesium.Cartesian3.fromDegrees(
		46.0363,
		51.5353403,
		1000,
	);

	var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
		7.1077496389876024807,
		-90,//-31.987223091598949054,
		0.025883251314954971306
	);

	var homeCameraView = {
		destination: initialPosition,
		orientation: {
			heading: initialOrientation.heading,
			pitch: initialOrientation.pitch,
			roll: initialOrientation.roll
		}
	};
	// Set the initial view
	viewer.scene.camera.setView(homeCameraView);

	// Add some camera flight animation options
	homeCameraView.duration = 2.0;
	homeCameraView.maximumHeight = 2000;
	homeCameraView.pitchAdjustHeight = 2000;
	homeCameraView.endTransform = Cesium.Matrix4.IDENTITY;
	// Override the default home button

	viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
		e.cancel = true;
		viewer.scene.camera.flyTo(homeCameraView);
	});

	// Set up clock and timeline.
	// viewer.clock.shouldAnimate = true; // default
	// viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
	// viewer.clock.stopTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:20:00Z");
	// viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2017-07-11T16:00:00Z");
	// viewer.clock.multiplier = 2; // sets a speedup
	// viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; // tick computation mode
	// viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // loop at the end
	// viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime); // set visible range

	return homeCameraView;
}

function load(viewer, homeCameraView) {
	const scene = viewer.scene;

	//////////////////////////////////////////////////////////////////////////
	// Loading and Styling Entity Data
	//////////////////////////////////////////////////////////////////////////

	// var kmlOptions = {
	// 	camera : viewer.scene.camera,
	// 	canvas : viewer.scene.canvas,
	// 	clampToGround : true
	// };
	// // Load geocache points of interest from a KML file
	// // Data from : http://catalog.opendata.city/dataset/pediacities-nyc-neighborhoods/resource/91778048-3c58-449c-a3f9-365ed203e914
	// var geocachePromise = Cesium.KmlDataSource.load('./Source/SampleData/sampleGeocacheLocations.kml', kmlOptions);

	// // Add geocache billboard entities to scene and style them
	// geocachePromise.then(function(dataSource) {
	// 	// Add the new data as entities to the viewer
	// 	viewer.dataSources.add(dataSource);

	loadGeojsonAreas(viewer);
	// initHover(viewer);
	initClick(viewer);
	// loadGeojsonArea(viewer);

	// loadModel(viewer, homeCameraView);

	return

	//////////////////////////////////////////////////////////////////////////
	// Load 3D Tileset
	//////////////////////////////////////////////////////////////////////////

	// Load the NYC buildings tileset
	// var city = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
	//     url: 'https://beta.cesium.com/api/assets/1461?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYWJmM2MzNS02OWM5LTQ3OWItYjEyYS0xZmNlODM5ZDNkMTYiLCJpZCI6NDQsImFzc2V0cyI6WzE0NjFdLCJpYXQiOjE0OTkyNjQ3NDN9.vuR75SqPDKcggvUrG_vpx0Av02jdiAxnnB1fNf-9f7s',
	//     maximumScreenSpaceError: 16 // default value
	// }));

	// Load the NYC buildings tileset
	var city = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
		url: './Source/SampleData/Tileset',
		maximumScreenSpaceError: 16 // default value
	}));

	// Adjust the tileset height so it's not floating above terrain
	var heightOffset = -32;
	city.readyPromise.then(function (tileset) {
		// Position tileset
		var boundingSphere = tileset.boundingSphere;
		var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
		var surfacePosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
		var offsetPosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
		var translation = Cesium.Cartesian3.subtract(offsetPosition, surfacePosition, new Cesium.Cartesian3());
		tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

		// homeCameraView.destination = translation;
		// homeCameraView.destination = tileset.modelMatrix;
		// homeCameraView.destination = offsetPosition;
	});

	// DRAW POLYGON

	// var wyoming = viewer.entities.add({
	// 	name : 'Wyoming',
	// 	polygon : {
	// 		hierarchy : Cesium.Cartesian3.fromDegreesArray([
	// 			-109.080842,45.002073,
	// 			// -105.91517,45.002073,
	// 			// -104.058488,44.996596,
	// 			// -104.053011,43.002989,
	// 			// -104.053011,41.003906,
	// 			// -105.728954,40.998429,
	// 			-107.919731,41.003906,
	// 			// -109.04798,40.998429,
	// 			// -111.047063,40.998429,
	// 			// -111.047063,42.000709,
	// 			// -111.047063,44.476286,
	// 			-111.05254,45.002073]),
	// 		height : 0,
	// 		material : Cesium.Color.RED.withAlpha(0.5),
	// 		outline : true,
	// 		outlineColor : Cesium.Color.BLACK
	// 	}
	// });
	// wyoming.polygon.extrudedHeight = 2500000;
	// viewer.zoomTo(wyoming);

	// DRAW 3D

	// var entity = viewer.entities.add({
	// 	// position : Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 1000),
	// 	position: Cesium.Cartesian3.fromDegrees(
	// 		46.0363,
	// 		51.5353403,
	// 		10,
	// 	),
	// 	model: {
	// 		uri: './Source/SampleData/Models/BlenderBox.gltf'
	// 		// uri: './Source/SampleData/Models/boxes.gltf'
	// 	}
	// });

	// viewer.trackedEntity = entity;
	// viewer.trackedEntity = city;

	return;

	//////////////////////////////////////////////////////////////////////////
	// Style 3D Tileset
	//////////////////////////////////////////////////////////////////////////

	// Define a white, opaque building style
	var defaultStyle = new Cesium.Cesium3DTileStyle({
		color: "color('white')",
		show: true
	});

	// Set the tileset style to default
	// city.style = defaultStyle;

	// Define a white, transparent building style
	var transparentStyle = new Cesium.Cesium3DTileStyle({
		color: "color('white', 0.3)",
		show: true
	});

	// Define a style in which buildings are colored by height
	var heightStyle = new Cesium.Cesium3DTileStyle({
		color: {
			conditions: [
				["${height} >= 300", "rgba(45, 0, 75, 0.5)"],
				["${height} >= 200", "rgb(102, 71, 151)"],
				["${height} >= 100", "rgb(170, 162, 204)"],
				["${height} >= 50", "rgb(224, 226, 238)"],
				["${height} >= 25", "rgb(252, 230, 200)"],
				["${height} >= 10", "rgb(248, 176, 87)"],
				["${height} >= 5", "rgb(198, 106, 11)"],
				["true", "rgb(127, 59, 8)"]
			]
		}
	});

	var tileStyle = document.getElementById('tileStyle');

	function set3DTileStyle() {
		var selectedStyle = tileStyle.options[tileStyle.selectedIndex].value;
		if (selectedStyle === 'none') {
			city.style = defaultStyle;
		} else if (selectedStyle === 'height') {
			city.style = heightStyle;
		} else if (selectedStyle === 'transparent') {
			city.style = transparentStyle;
		}
	}

	tileStyle.addEventListener('change', set3DTileStyle);

	//////////////////////////////////////////////////////////////////////////
	// Custom mouse interaction for highlighting and selecting
	//////////////////////////////////////////////////////////////////////////

	// If the mouse is over a point of interest, change the entity billboard scale and color
	var previousPickedEntity;
	var handler = viewer.screenSpaceEventHandler;
	handler.setInputAction(function (movement) {
		var pickedPrimitive = viewer.scene.pick(movement.endPosition);
		var pickedEntity = Cesium.defined(pickedPrimitive) ? pickedPrimitive.id : undefined;
		// Unhighlight the previously picked entity
		if (Cesium.defined(previousPickedEntity)) {
			previousPickedEntity.billboard.scale = 1.0;
			previousPickedEntity.billboard.color = Cesium.Color.WHITE;
		}
		// Highlight the currently picked entity
		if (Cesium.defined(pickedEntity) && Cesium.defined(pickedEntity.billboard)) {
			pickedEntity.billboard.scale = 2.0;
			pickedEntity.billboard.color = Cesium.Color.ORANGERED;
			previousPickedEntity = pickedEntity;
		}
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

	//////////////////////////////////////////////////////////////////////////
	// Setup Camera Modes
	//////////////////////////////////////////////////////////////////////////

	var freeModeElement = document.getElementById('freeMode');
	var droneModeElement = document.getElementById('droneMode');

	// Create a follow camera by tracking the drone entity
	function setViewMode() {
		if (droneModeElement.checked) {
			viewer.trackedEntity = drone;
		} else {
			viewer.trackedEntity = undefined;
			viewer.scene.camera.flyTo(homeCameraView);
		}
	}

	freeModeElement.addEventListener('change', setViewMode);
	droneModeElement.addEventListener('change', setViewMode);

	viewer.trackedEntityChanged.addEventListener(function () {
		if (viewer.trackedEntity === drone) {
			freeModeElement.checked = false;
			droneModeElement.checked = true;
		}
	});

	//////////////////////////////////////////////////////////////////////////
	// Setup Display Options
	//////////////////////////////////////////////////////////////////////////

	var shadowsElement = document.getElementById('shadows');
	var neighborhoodsElement = document.getElementById('neighborhoods');

	shadowsElement.addEventListener('change', function (e) {
		viewer.shadows = e.target.checked;
	});

	neighborhoodsElement.addEventListener('change', function (e) {
		neighborhoods.show = e.target.checked;
		tileStyle.value = 'transparent';
		// city.style = transparentStyle;
	});

	// Finally, wait for the initial city to be ready before removing the loading indicator.
	// var loadingIndicator = document.getElementById('loadingIndicator');
	// loadingIndicator.style.display = 'block';
	// city.readyPromise.then(function () {
	// loadingIndicator.style.display = 'none';
	// });
}

function loadModel(viewer, homeCameraView) {
	const scene = viewer.scene;

	// Load a drone flight path from a CZML file
	// var dronePromise = Cesium.CzmlDataSource.load('./Source/SampleData/SampleFlight.czml');

	// Save a new drone model entity
	// var drone;
	// dronePromise.then(function(dataSource) {
	//     viewer.dataSources.add(dataSource);
	//     drone = dataSource.entities.values[0];
	//     // Attach a 3D model
	//     drone.model = {
	//         uri : './Source/SampleData/Models/CesiumDrone.gltf',
	//         minimumPixelSize : 128,
	//         maximumScale : 2000
	//     };
	//     // Add computed orientation based on sampled positions
	//     drone.orientation = new Cesium.VelocityOrientationProperty(drone.position);
	//
	//     // Smooth path interpolation
	//     drone.position.setInterpolationOptions({
	//         interpolationAlgorithm : Cesium.HermitePolynomialApproximation,
	//         interpolationDegree : 2
	//     });
	//     drone.viewFrom = new Cesium.Cartesian3(-30, 0, 0);
	// });

	var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
		Cesium.Cartesian3.fromDegrees(
			46.056730168853719,
			51.529049848119428,
			0.0));

	// var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
	// 	Cesium.Cartesian3.fromDegrees(
	// 		46.003294673072055,
	// 		51.520526201760561,
	// 		0.0));

	var model = scene.primitives.add(Cesium.Model.fromGltf({
		// url: './Source/SampleData/Models/BlenderBox.gltf',
		url: './Source/SampleData/Models/saratov-test-solid-b.gltf',
		// url: './Source/SampleData/Models/G.gltf',
		// url: './Source/SampleData/Models/CesiumDrone.gltf',
		modelMatrix: modelMatrix,
		scale: 1,
	}));

	// model.position.setInterpolationOptions({
	// 	interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
	// 	interpolationDegree: 2
	// });

	var position = Cesium.Matrix4.getTranslation(modelMatrix, new Cesium.Cartesian3());
	homeCameraView.destination = position;
	return model;
}

function loadGeojsonArea(viewer) {
	var geojsonOptions = {
		clampToGround: true
	};

	const pois = Cesium.GeoJsonDataSource
		.load('./Source/SampleData/saratov-poi.geojson', geojsonOptions)
		.then(dataSource => dataSource.entities.values)
		.then(es => es.map(entity => {
			// if (Cesium.defined(entity.billboard)) {
			// Adjust the vertical origin so pins sit on terrain
			// entity.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

			// Disable the labels to reduce clutter
			// entity.label = undefined;

			// Add distance display condition
			// entity.billboard.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(10.0, 20000.0);

			// Compute latitude and longitude in degrees
			// const cartographicPosition = Cesium.Cartographic.fromCartesian(entity.position.getValue(Cesium.JulianDate.now()));
			// const latitude = Cesium.Math.toDegrees(cartographicPosition.latitude);
			// const longitude = Cesium.Math.toDegrees(cartographicPosition.longitude);

			// Modify description
			// const description = '<table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>';
			// description += '<tr><th>' + "Latitude" + '</th><td>' + latitude + '</td></tr>';
			// description += '<tr><th>' + "Longitude" + '</th><td>' + longitude + '</td></tr>';
			// description += '</tbody></table>';
			// entity.description = description;
			// }
			return entity;
		}));

	// Load neighborhood boundaries from a GeoJson file
	// Data from : https://data.cityofnewyork.us/City-Government/Neighborhood-Tabulation-Areas/cpf4-rkhq
	// var neighborhoodsPromise = Cesium.GeoJsonDataSource.load('./Source/SampleData/sampleNeighborhoods.geojson', geojsonOptions);
	var neighborhoodsPromise = Cesium.GeoJsonDataSource.load('./Source/SampleData/saratov.geojson', geojsonOptions);

	// Save an new entity collection of neighborhood data
	var neighborhoods;
	neighborhoodsPromise.then(function (dataSource) {
		// Add the new data as entities to the viewer
		viewer.dataSources.add(dataSource);
		neighborhoods = dataSource.entities;

		// Get the array of entities
		var neighborhoodEntities = dataSource.entities.values;
		// for (var i = 0; i < neighborhoodEntities.length; i++) {
		// 	var entity = neighborhoodEntities[i];
		//
		// 	if (Cesium.defined(entity.polygon)) {
		// 		// Use kml neighborhood value as entity name
		// 		entity.name = entity.properties.neighborhood;
		// 		// Set the polygon material to a random, translucent color
		// 		entity.polygon.material = Cesium.Color.fromRandom({
		// 			red : 0.1,
		// 			maximumGreen : 0.5,
		// 			minimumBlue : 0.5,
		// 			alpha : 0.6
		// 		});
		// 		// Generate Polygon center
		// 		var polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
		// 		var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
		// 		polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
		// 		entity.position = polyCenter;
		// 		// Generate labels
		// 		entity.label = {
		// 			text : entity.name,
		// 			showBackground : true,
		// 			scale : 0.6,
		// 			horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
		// 			verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
		// 			distanceDisplayCondition : new Cesium.DistanceDisplayCondition(10.0, 8000.0),
		// 			disableDepthTestDistance : Number.POSITIVE_INFINITY
		// 		};
		// 	}
		// }
	});
}

// function rgba([r, g, b]) {
// 	return {
// 		red: r / 255,
// 		green: g / 255,
// 		blue: b / 255,
// 		alpha: 1,
// 	}
// }

function getAreaMaterial(entity) {
	const type = entity.properties.layer_name.getValue();
	// const type = entity.getProperty('layer_name');

	const rgba = ([r, g, b]) => ({
		red: r / 255,
		green: g / 255,
		blue: b / 255,
		alpha: 1,
	})

	const types = {
		'Историческая тип 0': rgba([209, 33, 33]),
		'Историческая тип 2': rgba([212, 97, 16]),
		'Историческая тип 3': rgba([241, 129, 5]),
		'Историческая тип 4': rgba([255, 190, 0]),
		'Трансформированная тип 2': rgba([29, 143, 247]),
		'Трансформированная тип 3': rgba([36, 1, 195]),
		'Трансформированная тип 4': rgba([0, 3, 56]),
	}

	// console.log(type, types[type]);

	// // return Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 0.0, 0.0, 0.5))
	//
	// // attributes : {
	// // 	color : Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 0.0, 0.0, 0.5))
	// // }

	const {red, green, blue, alpha} = types[type]
	return new Cesium.Color(red, green, blue, alpha);
	// return new Cesium.Color(1.0, 0.0, 0.0, 0.5)

	const mat = new Cesium.Color(types[type]);
	return mat;
}

function loadGeojsonAreas(viewer) {
	var geojsonOptions = {
		clampToGround: true,
		// strokeWidth: 2,
		// stroke: Cesium.Color.WHITE,
	};

	// {
	// 	stroke: Cesium.Color.HOTPINK,
	// 		fill: Cesium.Color.PINK,
	// 	strokeWidth: 3,
	// 	markerSymbol: '?'
	// }

	const url = './Source/SampleData/Models/saratov-areas-sample.geojson'
	// const url = './Source/SampleData/Models/saratov-areas.geojson'

	// Load neighborhood boundaries from a GeoJson file
	return Cesium.GeoJsonDataSource
		.load(url, geojsonOptions)
		.then(function (dataSource) {
			// dataSource = dataSource.slice(0, 10);

			// Add the new data as entities to the viewer
			viewer.dataSources.add(dataSource);

			// Get the array of entities
			return dataSource.entities.values
				.map(entity => {
					if (Cesium.defined(entity.polygon)) {
						const height = entity.properties.height;

						if (height) {
							entity.polygon.extrudedHeight = height;
						}

						// 		// Use kml neighborhood value as entity name
						// 		entity.name = entity.properties.neighborhood;

						// Set the polygon material to a random, translucent color
						entity.polygon.material = getAreaMaterial(entity);
						// entity.polygon.outline = false;
						entity.polygon.outlineColor = new Cesium.Color(0.0, 0.0, 0.0, 1.0);
						entity.polygon.outlineWidth = 5;

						// entity.stroke = Cesium.Color.HOTPINK;

						// entity.model.silhouetteColor = Cesium.Color.WHITE;

						// 		// Generate Polygon center
						// 		var polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
						// 		var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
						// 		polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
						// 		entity.position = polyCenter;
						// 		// Generate labels
						// 		entity.label = {
						// 			text : entity.name,
						// 			showBackground : true,
						// 			scale : 0.6,
						// 			horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
						// 			verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
						// 			distanceDisplayCondition : new Cesium.DistanceDisplayCondition(10.0, 8000.0),
						// 			disableDepthTestDistance : Number.POSITIVE_INFINITY
						// 		};
					}
				})
		});
}

function initHover(viewer) {
	let current;

	function highlightOn(entity) {
		if (entity === current) return;

		highlightOff();
		entity.polygon.material = new Cesium.Color(1.0, 1.0, 1.0, 0.5);
		entity.polygon.outlineColor = new Cesium.Color(1.0, 1.0, 1.0, 1.0);
		// entity.polygon.outlineWidth = 2;
		current = entity;
	}

	function highlightOff() {
		if (current) {
			current.polygon.material = getAreaMaterial(current);
			entity.polygon.outlineColor = new Cesium.Color(0.0, 0.0, 0.0, 1.0);
		}
		current = null;
	}

	function onMouseMove(movement) {
		// // If a feature was previously highlighted, undo the highlight
		// if (Cesium.defined(highlighted.feature)) {
		// 	highlighted.feature.color = highlighted.originalColor;
		// 	highlighted.feature = undefined;
		// }

		// Pick a new feature
		var pickedFeature = viewer.scene.pick(movement.endPosition);
		if (!Cesium.defined(pickedFeature)) {
			highlightOff();
		} else {
			// console.log(pickedFeature.id)

			// A feature was picked, so show it's overlay content
			// nameOverlay.style.display = 'block';
			// nameOverlay.style.bottom = viewer.canvas.clientHeight - movement.endPosition.y + 'px';
			// nameOverlay.style.left = movement.endPosition.x + 'px';
			// var name = pickedFeature.getProperty('name');
			// if (!Cesium.defined(name)) {
			// 	name = pickedFeature.getProperty('id');
			// }
			// nameOverlay.textContent = name;

			// pickedFeature.color = Cesium.Color.YELLOW;
			// pickedFeature.color = Cesium.Color.WHITE;

			// if (current) {
			// 	highlightOff(current);
			// }

			highlightOn(pickedFeature.id);
			// pickedFeature.id.polygon.outline = true;

			// Highlight the feature if it's not already selected.
			// if (pickedFeature !== selected.feature) {
			// 	highlighted.feature = pickedFeature;
			// 	Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
			// 	pickedFeature.color = Cesium.Color.YELLOW;
			// }
		}
	}

	// Color a feature yellow on hover.
	viewer.screenSpaceEventHandler.setInputAction(onMouseMove, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

function initClick(viewer) {
	// Information about the currently selected feature
	let selected = null;

	// Color a feature on selection and show metadata in the InfoBox.
	var clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

	function onLeftClick(event) {
		// If a feature was previously selected, undo the highlight
		if (selected) {
			selected.id.polygon.material = getAreaMaterial(selected.id);
			selected = null;
		}

		// Pick a new feature
		var pickedFeature = viewer.scene.pick(event.position);

		if (!pickedFeature) {
			clickHandler(event);
			return;
		}

		selected = pickedFeature;

		// Highlight newly selected feature
		selected.id.polygon.material = new Cesium.Color(1.0, 1.0, 1.0, 0.5);

		// Set feature infobox description
		// var featureName = pickedFeature.getProperty('name');
		// selectedEntity.name = featureName;
		// selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
		// viewer.selectedEntity = selectedEntity;
		// selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>' +
		// 	'<tr><th>BIN</th><td>' + pickedFeature.getProperty('BIN') + '</td></tr>' +
		// 	'<tr><th>DOITT ID</th><td>' + pickedFeature.getProperty('DOITT_ID') + '</td></tr>' +
		// 	'<tr><th>SOURCE ID</th><td>' + pickedFeature.getProperty('SOURCE_ID') + '</td></tr>' +
		// 	'</tbody></table>';

		clickHandler(event);
	}

	viewer.screenSpaceEventHandler.setInputAction(onLeftClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function main() {
	Cesium.BingMapsApi.defaultKey = 'AihaXS6TtE_olKOVdtkMenAMq1L5nDlnU69mRtNisz1vZavr1HhdqGRNkB2Bcqvs'; // For use with this application only

	//////////////////////////////////////////////////////////////////////////
	// Creating the Viewer
	//////////////////////////////////////////////////////////////////////////

	var viewer = new Cesium.Viewer('cesiumContainer', {
		scene3DOnly: true,
		selectionIndicator: false,
		baseLayerPicker: false,
		animation: false,
		timeline: false,
	});

	loadImagery(viewer);
	// loadTerrain(viewer);

	const homeCameraView = configure(viewer);

	load(viewer, homeCameraView);
}

main();