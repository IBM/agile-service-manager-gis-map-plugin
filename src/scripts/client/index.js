import '../../css/style.css';
import 'leaflet-search';
import 'leaflet.markercluster';
import L from 'leaflet';
import {
    Loading,
    InlineLoading,
} from 'carbon-components';

import loadMapLocations from './loadMapLocations';
import createClusterGroup from './createClusterGroup';
import createSearchControl from './createSearchControl';
import processUrlOptions from './processUrlOptions';
import { createMarkerType } from './createMarkerType';
import { createBoundaryType } from './createBoundaryType';
import { createLinkType } from './createLinkType';
import addWeatherLayers from './addWeatherLayers';
import getZoomLevel from './utils/getZoomLevel';
import { setZoomLayerLocationTypes } from './plotAllLocations';
import { endRequest, startRequest } from './requestHandler';

(function() {
    const configParams = processUrlOptions();
    // Pull the map tiles from wikimedia
    var wikimedia = L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}@2x.png', {
        attribution: 'Wikimedia maps beta | &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19, // Make official zoom range 0-15
        minZoom: 4,
        noWrap: true
    });

    var map = L.map('map', {
        center: configParams.initialViewLocation.split(','),
        // Adjusted zoom level as min zoom 4 and max 19, config range 0 - 15 
        zoom: configParams.initialZoomLevel + 4,
        layers: [wikimedia],
        // Set max bounds to be the world
        maxBounds: [
            [90, 180],
            [-90, -180]
        ]
    });

    // Create marker groups for each marker entity type
    const markerTypes = {};
    configParams.markerEntityTypes.forEach( type => {
        markerTypes[type] = createMarkerType(type);
    })


    // Create boundary groups for each geoBoundary type
    const boundaryTypes = {};
    if (!configParams.hideGeoBoundary) {
        configParams.geoBoundaryTypes.forEach( type => {
            boundaryTypes[type] = createBoundaryType(type);
        })
    }
    
    // Create link groups for each link type
    const linkTypes = {};
    if(!configParams.hideLinks) {
        configParams.locationLinkTypes.forEach( type => {
            linkTypes[type] = createLinkType(type);
        });
    }

    // Define the cluster grouping for all markers
    const clusterGroup = createClusterGroup(map, configParams);

    // Need to add overlay layers for each layer type
    const overlays = {};

    Object.keys(markerTypes).forEach(type => {
        // Add each marker type to the layer controls for filtering
        overlays[type] = markerTypes[type].clusterGroup;
        if (configParams.affectedRadiusProps.length && !configParams.hideAffectedRadius) {
            overlays[type + '_affected_raidus'] = markerTypes[type].affectedRadiusMarkersLayer;
            map.addLayer(markerTypes[type].affectedRadiusMarkersLayer);
        }
        // Add each marker type to the clustering
        clusterGroup.addLayer(markerTypes[type].clusterGroup);
    })

    if (!configParams.hideGeoBoundary) {
        Object.keys(boundaryTypes).forEach(type => {
            // Add each boundary type to the layer controls for filtering
            overlays[type] = boundaryTypes[type].clusterGroup;
            // Add each boundary type to the clustering
            clusterGroup.addLayer(overlays[type]);
        });
    }

    if(!configParams.hideLinks) {
        Object.keys(linkTypes).forEach(type => {
            let typeName = type;
            if (type === '*') {
                typeName = 'relationships';
            }
            // Add each link type to the layer controls for filtering
            overlays[typeName] = linkTypes[type].clusterGroup;
            // Add each link type to the clustering
            clusterGroup.addLayer(overlays[typeName]);
        });
    }

    // Add cluster group to the map
    map.addLayer(clusterGroup);

    // Add weather layer
    if (configParams.openWeatherMapApiId) {
        addWeatherLayers(overlays, configParams.openWeatherMapApiId);
    }

    const layerControl = L.control.layers(null, overlays).addTo(map);

    const loadingInstance = Loading.create(document.getElementById('my-loading'));
    const inlineLoadingInstance = InlineLoading.create(document.getElementById('my-inline-loading'))
    inlineLoadingInstance.setState(InlineLoading.states.FINISHED);

    const view = {
        map,
        layerControl,
        markerTypes,
        boundaryTypes,
        linkTypes,
        linkMap: {},
        gridCache: {},
        activeRequests: {},
        endRequest: endRequest,
        startRequest: startRequest,
        clusterGroup,
        configParams,
        loadingInstance,
        inlineLoadingInstance
    };

    view.currentZoomLevel = getZoomLevel(view);

    // Add the search control
    const searchControl = createSearchControl(view);
    map.addControl(searchControl);
    
    map.whenReady(() => {
        // TODO work out how to refrsh and get all types when not using zoomType
        map.on('zoomend', function () {
            view.currentZoomLevel = getZoomLevel(view);
            setZoomLayerLocationTypes(view);
        });
        loadMapLocations(view);
    });
})()