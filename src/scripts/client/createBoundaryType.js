import L from 'leaflet';
export function createBoundaryType(type) {
    return {
        boundaryType: type,
        boundaries: {},
        clusterGroup: L.layerGroup()
    };
}