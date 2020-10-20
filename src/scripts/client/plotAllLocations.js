import L from 'leaflet';
import { addMarker, updateMarker } from './marker';
// import fitMap from './fitMap';
import addUrlParams from './utils/addUrlParams';
import getProvidedValue from './utils/getProvidedValue';
import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';

const TIMING_INFO = false;

// Create layer filter on each location type
// https://leafletjs.com/examples/layers-control/

// Status filtering

// affected area https://leafletjs.com/reference-1.6.0.html#circle

// _at time to get view of world ar time point

export default function plotAllLocations(view, maintainZoom) {
    if (!maintainZoom) {
        view.loadingInstance.set(true);
    }
    if (view.configParams.groupIds.length) {
        getAllGroupLocations(view, maintainZoom)
    } else {
        getAllLocations(view, maintainZoom);
    }
}

function locationParams(view, config) {
    console.log('Map bounds', );
    let params = '&_return_composites=' + config.returnComposites +
    '&_field=name' +
    '&_field=entityTypes' +
    '&_field=geolocation' +
    '&_include_status_severity=true' +
    '&_limit=' + config.locationLimit;

    // Add geobounds filtering
    const currentBounds = view.map.getBounds();
    if (currentBounds) {
        params += `&_geoshape=${currentBounds._southWest.lat}`;
        params += `&_geoshape=${currentBounds._southWest.lng}`;
        params += `&_geoshape=${currentBounds._northEast.lat}`;
        params += `&_geoshape=${currentBounds._northEast.lng}`;
    }

    params = addUrlParams(params, config.latProps, '_field');
    params = addUrlParams(params, config.longProps, '_field');

    params = addUrlParams(params, config.affectedRadiusProps, '_field');
    params = addUrlParams(params, config.tooltipProperties, '_field');

    
    params = addUrlParams(params, config.linkColorProps, '_field');

    if(!config.hideLinks) {
        params = addUrlParams(params, config.locationLinkTypes, '_relation');
    }
    return params;
}

function getAllGroupLocations(view, maintainZoom) {
    const config = view.configParams;
    const locationGroupArray = config.groupIds;
    const locationTypeRequests = {};
    locationGroupArray.forEach( locationType => {
        locationTypeRequests[locationType] = false;
    });

    const locationTypeRequestComplete = (locationType) => {
        locationTypeRequests[locationType] = true;
        if (Object.values(locationTypeRequests).every( v => v)) {
            if(!maintainZoom) {
                // fitMap(view);
            }
            if(!config.hideLinks) {
                addLinks(view);
            }
            view.loadingInstance.set(false);
        }
    }

    const params = locationParams(view, config);

    locationGroupArray.forEach( groupId => {
        let url = `/proxy_service/topology/resources/${groupId}/references/out/groups?`;
        url += params;

        fetch(url)
        .then(function(response) {
            return response.json()
        }).then(function(data) {
            if (data.hasOwnProperty('_items')) {
                TIMING_INFO && console.log(`Call to process ${groupId} started`);
                const t0 = performance.now();
                data._items.forEach((location) => {
                    if (location.geolocation || 
                        (getProvidedValue(config.latProps, location) && getProvidedValue(config.longProps, location))
                        ) {
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
                TIMING_INFO && console.log(`Call to process ${groupId} took ${t1 - t0} milliseconds.`);
            }
            locationTypeRequestComplete(groupId);
        }).catch(function(err) {
            TIMING_INFO && console.error(`Failed to request ${groupId} data: ${err}`);
            locationTypeRequestComplete(groupId);
        })
    }) 
}

function getAllLocations(view, maintainZoom) {
    const config = view.configParams;
    const locationTypesArray = config.locationTypes;
    const locationTypeRequests = {};
    locationTypesArray.forEach( locationType => {
        locationTypeRequests[locationType] = false;
    });

    const locationTypeRequestComplete = (locationType) => {
        locationTypeRequests[locationType] = true;
        if (Object.values(locationTypeRequests).every( v => v)) {
            if(!maintainZoom) {
                // fitMap(view);
            }
            if(!config.hideLinks) {
                addLinks(view);
            }
            view.loadingInstance.set(false);
        }
    }
    let baseUrl = '/proxy_service/topology/resources?' + locationParams(view, config);

    locationTypesArray.forEach( locationType => {
        let url = baseUrl +
        '&_type=' + locationType;

        fetch(url)
        .then(function(response) {
            return response.json()
        }).then(function(data) {
            if (data.hasOwnProperty('_items')) {
                TIMING_INFO && console.log(`Call to process ${locationType} started`);
                const t0 = performance.now();
                data._items.forEach((location) => {
                    if (location.geolocation || 
                        (getProvidedValue(config.latProps, location) && getProvidedValue(config.longProps, location))
                        ) {
                            // N.B. This will only ever add location, deleted locations will remain
                            if(view.markerTypes[locationType].locationsMap[location._id]) {
                                updateMarker(view, locationType, location)
                            } else {
                                addMarker(view, locationType, location);
                            }
                    }
                });
                const t1 = performance.now();
                TIMING_INFO && console.log(`Call to process ${locationType} took ${t1 - t0} milliseconds.`);
            }
            locationTypeRequestComplete(locationType);
        }).catch(function(err) {
            console.error(`Failed to request ${locationType} data: ${err}`);
            locationTypeRequestComplete(locationType);
        })
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

    view.configParams.locationTypes.forEach(locationType => {
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