import L from 'leaflet';
import { addMarker, updateMarker } from './marker';
import addUrlParams from './utils/addUrlParams';
import getProvidedValue from './utils/getProvidedValue';
import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';
import { addBoundary, updateBoundary } from './boundary';

const TIMING_INFO = false;

// Create layer filter on each location type
// https://leafletjs.com/examples/layers-control/

// Status filtering

// affected area https://leafletjs.com/reference-1.6.0.html#circle

// _at time to get view of world ar time point

function addGeoFilter(view, filterMode, geoBounds) {
    let filterCondition= '';
    switch (filterMode) {
        case 'CONTAINS': // CONTAINS  any geolocation that contains the circle 
            filterCondition = '>';
            break;
        case 'INTERSECT':  // INTERSECT any geolocation that intersects with the circle 
            filterCondition = ':';
            break;
        case 'DISJOINT': // DISJOINT  any geolocation not intersecting the circle
            filterCondition = "!:";
            break;
        case 'WITHIN': // WITHIN    any geolocation within the box   
        default:
            filterCondition = '<';
            break;
    }
    const currentBounds = geoBounds || view.map.getBounds();
    if (currentBounds) {
        const filter = encodeURIComponent(`geolocation${filterCondition}box,${currentBounds._southWest.lat},${currentBounds._southWest.lng},${currentBounds._northEast.lat},${currentBounds._northEast.lng}`);
        return `&_filter=${filter}`;
    }
}

function locationParams(view, config, geoFilterMode, geoBounds) {
    let params = '&_return_composites=' + config.returnComposites +
    '&_field=name' +
    '&_field=entityTypes' +
    '&_field=geolocation' +
    '&_include_status_severity=true' +
    '&_limit=' + config.locationLimit;

    params += addGeoFilter(view, geoFilterMode, geoBounds);
    
    params = addUrlParams(params, config.affectedRadiusProps, '_field');
    params = addUrlParams(params, config.tooltipProperties, '_field');

    
    params = addUrlParams(params, config.linkColorProps, '_field');

    if(!config.hideLinks) {
        params = addUrlParams(params, config.locationLinkTypes, '_relation');
    }
    return params;
}

export function setZoomLayerLocationTypes(view) {
    const config = view.configParams;
    if (config.locationTypesConfig && config.locationTypesConfig.length) {
        view.clusterGroup.clearLayers();
        config.zoomLevelTypeMap[view.currentZoomLevel].markerTypes.forEach( type => {
            if (view.markerTypes[type]) {
                view.clusterGroup.addLayer(view.markerTypes[type].clusterGroup);
            }
        });
    }
}

function getGroupType({view, locationTypeConfig, geoFilterMode}) {
    const config = view.configParams;
    const params = locationParams(view, config, geoFilterMode, locationTypeConfig.geoBounds);
    
    const timestamp = new Date();
    let requestId = `getGroupType-${locationTypeConfig.entityType}-${timestamp.getTime()}`;
    if (locationTypeConfig.geoBounds) {
        requestId += `-${JSON.stringify(locationTypeConfig.geoBounds)}`;
    }
    let url = `/proxy_service/topology/groups?_type=${locationTypeConfig.entityType}`;
    url += params;
    view.startRequest(view, requestId);
    const getGroupMembers = locationTypeConfig.memberEntityTypes &&
                            Array.isArray(locationTypeConfig.memberEntityTypes) &&
                            locationTypeConfig.memberEntityTypes.length;
    fetch(url)
    .then(function(response) {
        return response.json()
    }).then(function(data) {
        if (data.hasOwnProperty('_items')) {
            const groupIds = [];
            data._items.forEach(location => {
                if (getGroupMembers) {
                    groupIds.push(location._id);
                }
                if (locationTypeConfig.locationStyle === 'marker' && location.geolocation) {
                    // N.B. This will only ever add location, deleted locations will remain
                    if(view.markerTypes[locationTypeConfig.entityType].locationsMap[location._id]) {
                        updateMarker(view, locationTypeConfig.entityType, location)
                    } else {
                        addMarker(view, locationTypeConfig.entityType, location);
                    }
                }
                if (locationTypeConfig.locationStyle === 'polygon' && location.geolocation) {
                    // N.B. This will only ever add location, deleted locations will remain
                    if(view.boundaryTypes[locationTypeConfig.entityType].boundaries[location._id]) {
                        updateBoundary(view, locationTypeConfig.entityType, location)
                    } else {
                        addBoundary(view, locationTypeConfig.entityType, location);
                    }
                }
            });
            if (groupIds.length) {
                getAllGroupLocations({groupIds, view, locationTypeConfig, geoFilterMode});
            } else {
                view.loadingInstance.set(false);
            }
        }
        view.endRequest(view, requestId);
    }).catch(function(err) {
        console.error(`Failed to get group type ids ${locationTypeConfig.entityType} data: ${err}`);
        view.endRequest(view, requestId);
    })
}


function getAllGroupLocations({groupIds, view, locationTypeConfig, geoFilterMode}) {
    const config = view.configParams;
    const numIds = groupIds.length;
    const maxConcurrentRequests = 1;
    const numberOfRequests = numIds < maxConcurrentRequests ? 1 : maxConcurrentRequests;
    const requestIndexArray = Array.apply(null, {length: numberOfRequests}).map(function(value, index) {
        return index + 1;
    });
    const locationTypeRequests = {};
    requestIndexArray.forEach( locationType => {
        locationTypeRequests[locationType] = false;
    });
    setZoomLayerLocationTypes(view)

    const locationTypeRequestComplete = (locationType) => {
        locationTypeRequests[locationType] = true;
        if (Object.values(locationTypeRequests).every( v => v)) {
            if(!config.hideLinks) {
                addLinks(view);
            }
            view.loadingInstance.set(false);
        }
    }
    const params = locationParams(view, config, geoFilterMode, locationTypeConfig.geoBounds)
    const segmentSize = Math.ceil(numIds/numberOfRequests)

    requestIndexArray.forEach( reqIndex => {
        const startSegmentIndex = (reqIndex - 1) * segmentSize;
        const endSegmentIndex = reqIndex * segmentSize;
        const ids = reqIndex === numberOfRequests ?
        groupIds.slice(startSegmentIndex).toString() : groupIds.slice(startSegmentIndex, endSegmentIndex).toString();
        let url = `/proxy_service/topology/resources/${ids}/references/out/groups?`;
        url += params;
        if (ids === '') {
            // No ids
            locationTypeRequestComplete(reqIndex);
            return;
        }

        const timestamp = new Date();
        let requestId = `getAllGroupLocations-${ids.slice(0, 5)}-${reqIndex}-${timestamp.getTime()}`;
        if (locationTypeConfig.geoBounds) {
            requestId += `-${JSON.stringify(locationTypeConfig.geoBounds)}`;
        }
        view.startRequest(view, requestId);
        fetch(url)
        .then(function(response) {
            return response.json()
        }).then(function(data) {
            if (data.hasOwnProperty('_items')) {
                TIMING_INFO && console.log(`Call to process ${reqIndex} started`);
                const t0 = performance.now();
                data._items.forEach((location) => {
                    if (location.geolocation) {
                            // N.B. This will only ever add location, deleted locations will remain

                            // Need to pick the type of the location
                            let type = '';
                            for(let i = 0; i < location.entityTypes.length && type === ''; i++) {
                                if (view.markerTypes[location.entityTypes[i]]) {
                                    type = location.entityTypes[i];
                                }
                            }
  
                            if(type && view.markerTypes[type].locationsMap[location._id]) {
                                updateMarker(view, type, location)
                            } else if (type) {
                                addMarker(view, type, location);
                            }
                    }
                });
                const t1 = performance.now();
                TIMING_INFO && console.log(`Call to process ${reqIndex} took ${t1 - t0} milliseconds.`);
                view.endRequest(view, requestId);
            }
            locationTypeRequestComplete(reqIndex);
        }).catch(function(err) {
            console.error(`Failed to request ${reqIndex} data: ${err}`);
            locationTypeRequestComplete(reqIndex);
            view.endRequest(view, requestId);
        })
    }) 
}

export function getGridTileLocations({view, locationTypeConfig}) {
    const config = view.configParams;
    const geoFilterMode = 'INTERSECT';
    setZoomLayerLocationTypes(view);

    if (locationTypeConfig.vertexType === 'group') {
        getGroupType({view, locationTypeConfig, geoFilterMode});
    } else {
        const timestamp = new Date();
        let requestId = `getGridTileLocations-${locationTypeConfig.entityType}-${timestamp.getTime()}`;
        if (locationTypeConfig.geoBounds) {
            requestId += `-${JSON.stringify(locationTypeConfig.geoBounds)}`;
        }
        view.startRequest(view, requestId);
        const locationTypeRequestComplete = () => {
            if(!config.hideLinks) {
                addLinks(view);
            }
            view.loadingInstance.set(false);
            view.endRequest(view, requestId);
        }
    
        getLocations({view, locationTypeConfig, callback: locationTypeRequestComplete, geoFilterMode});
    }
}

function getLocations({view, locationTypeConfig, callback, geoFilterMode}) {
    const config = view.configParams;
    const baseUrl = '/proxy_service/topology/resources?' + locationParams(view, config, geoFilterMode, locationTypeConfig.geoBounds);
    const url = baseUrl + '&_type=' + locationTypeConfig.entityType;
    fetch(url)
    .then(function(response) {
        return response.json()
    }).then(function(data) {
        if (data.hasOwnProperty('_items')) {
            TIMING_INFO && console.log(`Call to process ${locationTypeConfig.entityType} started`);
            const t0 = performance.now();
            data._items.forEach((location) => {
                if (locationTypeConfig.locationStyle === 'polygon' && location.geolocation) {
                    // N.B. This will only ever add location, deleted locations will remain
                    if(view.boundaryTypes[locationTypeConfig.entityType].boundaries[location._id]) {
                        updateBoundary(view, locationTypeConfig.entityType, location)
                    } else {
                        addBoundary(view, locationTypeConfig.entityType, location);
                    }
                } else if (location.geolocation) {
                    // N.B. This will only ever add location, deleted locations will remain
                    if(view.markerTypes[locationTypeConfig.entityType].locationsMap[location._id]) {
                        updateMarker(view, locationTypeConfig.entityType, location)
                    } else {
                        addMarker(view, locationTypeConfig.entityType, location);
                    }
                }
                
            });
            const t1 = performance.now();
            TIMING_INFO && console.log(`Call to process ${locationTypeConfig.entityType} took ${t1 - t0} milliseconds.`);
        }
        if (callback && typeof callback === 'function') {
            callback();
        }
    }).catch(function(err) {
        console.error(`Failed to request ${locationTypeConfig.entityType} data: ${err}`);
        if (callback && typeof callback === 'function') {
            callback();
        }
    })
}


function addLinks(view) {
    TIMING_INFO && console.log(`Call to process links started`);
    const t0 = performance.now();
    let allLinkTypes = false;
    if (view.configParams.locationLinkTypes && view.configParams.locationLinkTypes.length &&
        view.configParams.locationLinkTypes[0] === '*') {
        allLinkTypes = true;
    }
    const processedEdgeIds = [];

    let combinedLocationMap = {};
    let combinedLocations = [];

    view.configParams.markerEntityTypes.forEach(locationType => {
        // Merge all types
        combinedLocationMap = {...combinedLocationMap, ...view.markerTypes[locationType].locationsMap};
        combinedLocations = [...combinedLocations, ...view.markerTypes[locationType].locations]
    });

    combinedLocations.forEach((location) => {
        if (location && location.hasOwnProperty('_references') && Array.isArray(location._references)) {
            location._references.forEach((edge) => {
                if (edge._id && combinedLocationMap[edge._fromId] && combinedLocationMap[edge._toId] && processedEdgeIds.indexOf(edge._id) === -1) {
                    let color = getProvidedValue(view.configParams.linkColorProps, edge) || '#000000';
                    // N.B. This will only ever add links, deleted links will remain
                    if(view.linkMap[edge._id]) {
                        const updateLine = view.linkMap[edge._id];
                        updateLine.setLatLngs([combinedLocationMap[edge._fromId], combinedLocationMap[edge._toId]]);
                        updateLine.setStyle({
                            color,
                            weight: 3,
                            opacity: 1,
                            smoothFactor: 1
                        });
                        processedEdgeIds.push(edge._id);
                    } else {
                        const line = L.polyline([combinedLocationMap[edge._fromId],
                            combinedLocationMap[edge._toId]
                        ], {
                            color,
                            weight: 3,
                            opacity: 1,
                            smoothFactor: 1
                        });
                        // Needs to go before the addLayer otherwise it doesn't show the links?
                        processedEdgeIds.push(edge._id);
                        view.linkMap[edge._id] = line;
                        view.linkTypes[allLinkTypes ? '*' : edge._edgeType].clusterGroup.addLayer(line);
                    }
                }
            })
        }
    });
    const t1 = performance.now();
    TIMING_INFO && console.log(`Call to process links took ${t1 - t0} milliseconds.`);
}