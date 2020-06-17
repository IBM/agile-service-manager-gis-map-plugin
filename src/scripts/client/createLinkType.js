import L from 'leaflet';
export function createLinkType(type) {
    return {
        linkType: type,
        links: {},
        clusterGroup: L.layerGroup()
    };
}