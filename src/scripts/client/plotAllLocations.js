import { addMarker, updateMarker } from './marker';
import addUrlParams from './utils/addUrlParams';
import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';
import { addBoundary, updateBoundary } from './boundary';
import findLocationType from './utils/findLocationType';
import { addLinks } from './links';

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
        config.zoomLevelTypeMap[view.currentZoomLevel].polygonTypes.forEach( type => {
            if (view.boundaryTypes[type]) {
                view.clusterGroup.addLayer(view.boundaryTypes[type].clusterGroup);
            }
        });

        config.locationLinkTypes.forEach( type => {
            if (view.linkTypes[type]) {
                view.clusterGroup.addLayer(view.linkTypes[type].clusterGroup);
            }
        });
    }
}

export function getGridTileLocations({view, locationTypeConfig, geoBounds}) {
    const geoFilterMode = 'INTERSECT';
    setZoomLayerLocationTypes(view);
    if (locationTypeConfig.source === 'locationService') {
        if (locationTypeConfig.tag) {
            getLocationsPostGisTag({view, locationTypeConfig, geoBounds, geoFilterMode});
        } else {
            getLocationsPostGis({view, locationTypeConfig, geoBounds, geoFilterMode});
        }
    } else if (locationTypeConfig.vertexType === 'group') {
        getGroupType({view, locationTypeConfig, geoBounds, geoFilterMode});
    } else {    
        getLocations({view, locationTypeConfig, geoBounds, geoFilterMode});
    }
}

function addLocationToMap({view, locationTypeConfig, location}) {
    if (location.geolocation && locationTypeConfig.locationStyle === 'polygon') {
        // N.B. This will only ever add location, deleted locations will remain
        if(view.boundaryTypes[locationTypeConfig.entityType].boundaries[location._id]) {
            updateBoundary(view, locationTypeConfig.entityType, location)
        } else {
            addBoundary(view, locationTypeConfig.entityType, location);
        }
    } else if ((location.geolocation || location.geometry ) && locationTypeConfig.locationStyle === 'marker') {
        // N.B. This will only ever add location, deleted locations will remain
        if(view.markerTypes[locationTypeConfig.entityType].locationsMap[location._id]) {
            updateMarker(view, locationTypeConfig.entityType, location)
        } else {
            addMarker(view, locationTypeConfig.entityType, location);
        }
    }
}

function getGroupType({view, locationTypeConfig, geoBounds, geoFilterMode}) {
    const config = view.configParams;
    const params = locationParams(view, config, geoFilterMode, geoBounds);
    
    const timestamp = new Date();
    let requestId = `getGroupType-${locationTypeConfig.entityType}-${timestamp.getTime()}`;
    if (geoBounds) {
        requestId += `-${JSON.stringify(geoBounds)}`;
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
                addLocationToMap({view, locationTypeConfig, location});
            });
            if (groupIds.length) {
                getAllGroupLocations({groupIds, view, geoBounds, geoFilterMode});
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


function getAllGroupLocations({groupIds, view, geoBounds, geoFilterMode}) {
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
    const params = locationParams(view, config, geoFilterMode, geoBounds)
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
        if (geoBounds) {
            requestId += `-${JSON.stringify(geoBounds)}`;
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
                            let type = findLocationType({view, location});
  
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

function getLocations({view, locationTypeConfig, geoBounds, geoFilterMode}) {
    const config = view.configParams;
    const timestamp = new Date();
    let requestId = `getGridTileLocations-${locationTypeConfig.entityType}-${timestamp.getTime()}`;
    if (geoBounds) {
        requestId += `-${JSON.stringify(geoBounds)}`;
    }
    view.startRequest(view, requestId);
    const locationTypeRequestComplete = () => {
        if(!config.hideLinks) {
            addLinks(view);
        }
        view.loadingInstance.set(false);
        view.endRequest(view, requestId);
    };
    const baseUrl = '/proxy_service/topology/resources?' + locationParams(view, config, geoFilterMode, geoBounds);
    const url = baseUrl + '&_type=' + locationTypeConfig.entityType;
    fetch(url)
    .then(function(response) {
        return response.json()
    }).then(function(data) {
        if (data.hasOwnProperty('_items')) {
            TIMING_INFO && console.log(`Call to process ${locationTypeConfig.entityType} started`);
            const t0 = performance.now();
            data._items.forEach((location) => {
                addLocationToMap({view, locationTypeConfig, location})
            });
            const t1 = performance.now();
            TIMING_INFO && console.log(`Call to process ${locationTypeConfig.entityType} took ${t1 - t0} milliseconds.`);
        }
        locationTypeRequestComplete();
    }).catch(function(err) {
        console.error(`Failed to request ${locationTypeConfig.entityType} data: ${err}`);
        locationTypeRequestComplete();
    })
}

function getLocationsPostGis({view, locationTypeConfig, geoBounds}) {
    const config = view.configParams;
    const timestamp = new Date();
    let requestId = `getLocationsPostGis-${locationTypeConfig.entityType}-${timestamp.getTime()}`;
    if (geoBounds) {
        requestId += `-${JSON.stringify(geoBounds)}`;
    }
    view.startRequest(view, requestId);
    const locationTypeRequestComplete = () => {
        if(!config.hideLinks) {
            addLinks(view);
        }
        view.loadingInstance.set(false);
        view.endRequest(view, requestId);
    };
    const url = '/location_service/sites?entityType=' + locationTypeConfig.entityType + '&lonMin=' + geoBounds._southWest.lng + '&latMin=' + geoBounds._southWest.lat + '&lonMax=' + geoBounds._northEast.lng + '&latMax=' + geoBounds._northEast.lat
    fetch(url)
    .then(function(response) {
        return response.json()
    }).then(function(data) {
        if (data && data.features && Array.isArray(data.features)) {
            data.features.forEach((feature) => {
                if (feature && feature.properties && feature.geometry) {
                    const location = {...feature.properties, ...{geometry: feature.geometry}};
                    addLocationToMap({view, locationTypeConfig, location})
                }
            });
        }
        locationTypeRequestComplete();
    }).catch(function(err) {
        console.error(`Failed to request ${locationTypeConfig.entityType} data: ${err}`);
        locationTypeRequestComplete();
    })
}

function getLocationsPostGisTag({view, locationTypeConfig, geoBounds}) {
    const config = view.configParams;
    const timestamp = new Date();
    let requestId = `getLocationsPostGisTag-${locationTypeConfig.entityType}-${timestamp.getTime()}`;
    if (geoBounds) {
        requestId += `-${JSON.stringify(geoBounds)}`;
    }
    view.startRequest(view, requestId);
    const locationTypeRequestComplete = () => {
        if(!config.hideLinks) {
            addLinks(view);
        }
        view.loadingInstance.set(false);
        view.endRequest(view, requestId);
    };
    const url = '/location_service/tag?tag=' + locationTypeConfig.tag + '&lonMin=' + geoBounds._southWest.lng + '&latMin=' + geoBounds._southWest.lat + '&lonMax=' + geoBounds._northEast.lng + '&latMax=' + geoBounds._northEast.lat
    fetch(url)
    .then(function(response) {
        return response.json()
    }).then(function(data) {
        if (data && data.features && Array.isArray(data.features)) {
            data.features.forEach((feature) => {
                if (feature && feature.properties && feature.geometry) {
                    const location = {...feature.properties, ...{geometry: feature.geometry, _id: feature.properties.name, entityTypes: locationTypeConfig.entityType}};
                    addLocationToMap({view, locationTypeConfig, location})
                }
            });
        }
        locationTypeRequestComplete();
    }).catch(function(err) {
        console.error(`Failed to request ${locationTypeConfig.entityType} data: ${err}`);
        locationTypeRequestComplete();
    })
}