import L from 'leaflet';
import { setViewToMarker } from './utils/setView';
import getLocationLatLng from './utils/getLocationLatLng';

export default function createSearchControl(view) {
    const searchLayers = [];
    Object.keys(view.markerTypes).forEach(type => {
        searchLayers.push(view.markerTypes[type].clusterGroup);
    })
    const fetchLocation = function(searchQuery) {
        return `/location_service/search?entityType=site&search=${searchQuery}&limit=10`;
    }
    const formatData = function(data) {
        const searchMap = {};
        if (data && data.features && Array.isArray(data.features)) {
            data.features.forEach(d => {
                if (d && d.properties && d.properties.name) {
                    searchMap[d.properties.name] = d;
                }
            });
        }
        return searchMap;
    };
    const moveToLocation = function(location) {
        let type = '';
        let latlng = null;

        if (location && location.layer && location.layer.feature &&
            location.layer.feature.properties && location.layer.feature.properties.type) {
            type = location.layer.feature.properties.type;
            latlng = location.latlng;
        } else if(location && location.properties && location.geometry) {
            type = location.properties.entityTypes;
            latlng = getLocationLatLng(location);
        }
        
        if (type && latlng) {
            setViewToMarker({view, latlng: latlng, type, useMaxZoom: true});
        }
        
        if (location.layer._popup){
            location.layer.openPopup();
        }
    }
    const searchControl = L.control.search({
        url: fetchLocation,
        formatData: formatData,
        moveToLocation: moveToLocation,
        // layer: L.layerGroup(searchLayers),
        marker: false,
        autoCollapse: true
    });

    // searchControl.on('search:locationfound', function (location) {
    //     let type = '';
    //     if (location && location.layer && location.layer.feature &&
    //         location.layer.feature.properties && location.layer.feature.properties.type) {
    //         type = location.layer.feature.properties.type;
    //     }
        
    //     setViewToMarker({view, latlng: location.latlng, type, useMaxZoom: true});
    //     if (location.layer._popup){
    //         location.layer.openPopup();
    //     }
    // });
    return searchControl;
}