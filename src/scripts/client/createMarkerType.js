import L from 'leaflet';
export function createMarkerType(type) {
    return {
        markerType: type,
        locationsMap: {},
        locations: [],
        markers: {},
        affectedRadiusMarkers: {},
        affectedRadiusMarkersLayer: L.layerGroup(),
        clusterGroup: L.layerGroup()
    };
}