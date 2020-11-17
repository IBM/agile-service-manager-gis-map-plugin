import L from 'leaflet';
import { setViewToMarker } from './utils/setView';

export default function createSearchControl(view) {
    const searchLayers = [];
    Object.keys(view.markerTypes).forEach(type => {
        searchLayers.push(view.markerTypes[type].clusterGroup);
    })
    const searchControl = L.control.search({
        layer: L.layerGroup(searchLayers),
        marker: false,
        autoCollapse: true
    });

    searchControl.on('search:locationfound', function (e) {
        let type = '';
        if (e && e.layer && e.layer.feature &&
            e.layer.feature.properties && e.layer.feature.properties.type) {
            type = e.layer.feature.properties.type;
        }
        
        setViewToMarker({view, latlng: e.latlng, type, useMaxZoom: true});
        if (e.layer._popup){
            e.layer.openPopup();
        }
    });
    return searchControl;
}