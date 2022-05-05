import { severityColors } from "./utils/status";
import L from 'leaflet';
import getProvidedValue from "./utils/getProvidedValue";

const setProperties = function(boundary, location, config) {
    let props = {
        id: location._id,
        name: location.name,
        totalCases: location.TotalCases,
        type: location.entityTypes[0],
        url: config.url + location._id
    };
    if (typeof location._hasStatus !== 'undefined' && location._hasStatus != null) {
        props['state'] = location._hasStatus;
    } else {
        props['state'] = "unknown";
    }

    let tooltipContent = '';
    let stateimage = '<img src="/markers/marker-' + props.state + '.svg" style="width:20px; height:20px" type="image/svg" title="State: ' + props.state + '">';
    tooltipContent += '<h3>' + props.name + ' ' + stateimage + '</h3><h6>' + props.type +  '</h6>';

    config.tooltipProperties.forEach( prop => {
        if (prop && location[prop] !== '' && typeof location[prop] !== 'undefined') {
            tooltipContent += '<h7> '+ prop + ': ' + location[prop] +  '</h7>';
        }
    });

    var latlngs = getProvidedValue(config.boundaryProps, location) || [];
    let boundaryPolygon = boundary;
    if (!boundaryPolygon) {
        boundaryPolygon = L.polygon(latlngs, {
            color: location._hasStatus ? severityColors[location._hasStatus] : '#03d3fc'
        });
        boundaryPolygon.on('mouseover', function () {
            this.openPopup();
        });
        boundaryPolygon.on('mouseout', function () {
            this.closePopup();
        });
        boundaryPolygon.bindPopup(tooltipContent);
    } else {
        boundaryPolygon.setLatLngs(latlngs);
        boundaryPolygon.setPopupContent(tooltipContent);
        boundaryPolygon.setStyle({
            color: location._hasStatus ? severityColors[location._hasStatus] : '#03d3fc'
        });
    }
    
    boundaryPolygon.feature = {
        properties: props,
    };
    return boundaryPolygon;
}

export function addBoundary(view, type, location) {
    const boundaries = view.boundaryTypes[type].boundaries || {};
    const clusterGroup = view.boundaryTypes[type].clusterGroup;
    const boundary = setProperties(null, location, view.configParams)

    clusterGroup.addLayer(boundary);
    boundaries[location._id] = boundary;
}

export function updateBoundary(view, type, location) {
    const boundaries = view.boundaryTypes[type].boundaries || {};
    const boundary = boundaries[location._id];
    setProperties(boundary, location, view.configParams)
}