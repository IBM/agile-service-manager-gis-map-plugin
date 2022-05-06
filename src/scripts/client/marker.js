import { severityToIcon } from './utils/iconDefinitions';
import L from 'leaflet';
import { severityColors } from './utils/status';
import getProvidedValue from './utils/getProvidedValue';

const setProperties = function(view, type, location, knownMarker) {
    const config = view.configParams;
    const markerLocationsMap = view.markerTypes[type] && view.markerTypes[type].locationsMap || {};
    let props = {
        id: location._id,
        name: location.name,
        type: location.entityTypes[0],
        url: config.url + location._id
    };
    if (Object.prototype.hasOwnProperty.call(location, '_hasStatus') && location._hasStatus != null) {
        props['state'] = location._hasStatus;
    } else {
        props['state'] = "unknown";
    }
    let icon = severityToIcon[props['state']];
    var latlng = new L.LatLng(getProvidedValue(config.latProps, location), getProvidedValue(config.longProps, location));
    markerLocationsMap[location._id] = latlng;

    let tooltipContent = '';
    let stateimage = '<img src="/markers/marker-' + props.state + '.svg" style="width:20px; height:20px" type="image/svg" title="State: ' + props.state + '">';
    tooltipContent += '<h3>' + props.name + ' ' + stateimage + '</h3><h6> ' + props.type + '</h6>';

    config.tooltipProperties.forEach( prop => {
        if (prop && location[prop] !== '' && typeof location[prop] !== 'undefined') {
            tooltipContent += '<h7> '+ prop + ': ' + location[prop] +  '</h7>';
        }
    });

    let marker = knownMarker;
    if(!marker) {
        marker = L.marker(latlng, {
            title: location.name,
            icon: icon
        });

        marker.bindPopup(tooltipContent);
        marker.on('mouseover', function () {
            this.openPopup();
        });
        marker.on('mouseout', function () {
            this.closePopup();
        });
    } else {
        marker.setLatLng(latlng);
        marker.setIcon(icon);
        marker.setPopupContent(tooltipContent);
    }
    marker.feature = {
        type: 'Point',
        properties: props,
        geometry: undefined
    };

    if (!config.hideAffectedRadius) {
        addAffectRadiusMarker(view, type, location, props);
    }
    
    return marker;
}

const addAffectRadiusMarker = function(view, type, location, props) {
    const config = view.configParams;
    const affectedRadiusMarkersLayer = view.markerTypes[type] && view.markerTypes[type].affectedRadiusMarkersLayer || null;
    const affectedRadiusMarkers = view.markerTypes[type] && view.markerTypes[type].affectedRadiusMarkers || null;

    let marker = affectedRadiusMarkers[location._id];

    var latlng = new L.LatLng(getProvidedValue(config.latProps, location) , getProvidedValue(config.longProps, location));

    let radius = getProvidedValue(config.affectedRadiusProps, location) || 0;

    let color = '#3388ff';
    if(location._hasStatus && severityColors[location._hasStatus]) {
        color = severityColors[location._hasStatus];
    }
    if(!marker && radius) {
        // Add radius marker
        marker = L.circle(latlng, {
            radius: radius,
            color
        });
        affectedRadiusMarkersLayer && affectedRadiusMarkersLayer.addLayer(marker);
        affectedRadiusMarkers[location._id] = marker;
        marker.feature = {
            properties: props
        };
    } else if (radius) {
        marker.setLatLng(latlng);
        marker.setRadius(radius);
        marker.setStyle({
            color
        })
        marker.feature = {
            properties: props
        };
    } else if (marker) {
        // delete
        affectedRadiusMarkersLayer && affectedRadiusMarkersLayer.removeLayer(marker);
        delete affectedRadiusMarkers[location._id];
    }
} 

export function addMarker(view, type, location) {
    const markerLocations = view.markerTypes[type] && view.markerTypes[type].locations || [];
    const markers = view.markerTypes[type] && view.markerTypes[type].markers || {};
    const clusterGroup = view.markerTypes[type] && view.markerTypes[type].clusterGroup || null;

    const marker = setProperties(view, type, location);

    markerLocations.push(location);
    if(clusterGroup) {
        clusterGroup.addLayer(marker);
    } else {
        view.clusterGroup.addLayer(marker);
    }
    markers[location._id] = marker;
}

export function updateMarker(view, type, location) {
    const markers = view.markerTypes[type].markers || {};
    const marker = markers[location._id];
    setProperties(view, type, location, marker);
}