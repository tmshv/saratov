import Cesium from 'cesium/Cesium';

const Imagery = {
    BING: 'bing',
    OSM: 'osm',
    MAP_BOX: 'mapbox',
}

const ImageryProvider = {
    [Imagery.BING]: createBingImageryProvider,
    [Imagery.OSM]: createOsmImageryProvider,
    [Imagery.MAP_BOX]: createMapBoxImageryProvider,
}

export function loadImagery(viewer, {imagery = []}) {
    if (!imagery.length) return

    const imageryLayer = imagery[0]
    const loader = ImageryProvider[imageryLayer.type]
    if (!loader) return

    viewer.imageryLayers.addImageryProvider(loader(imageryLayer));

    return viewer
}

function createBingImageryProvider({
                                       apiKey,
                                       contrast = 1.5,
                                       url = 'https://dev.virtualearth.net',
                                       mapStyle = Cesium.BingMapsStyle.AERIAL
                                   }) {
    const key = apiKey
	const provider = new Cesium.BingMapsImageryProvider({
        key,
        url,
        mapStyle,
	});
    provider.defaultContrast = contrast

    return provider
}

function createOsmImageryProvider({url = 'https://a.tile.openstreetmap.org/'}) {
    return Cesium.createOpenStreetMapImageryProvider({
        url,
    })
}

function createMapBoxImageryProvider({mapId, accessToken}) {
    return new Cesium.MapboxImageryProvider({
        mapId,
        accessToken,
    })
}