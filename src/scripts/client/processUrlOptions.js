import { addUniqueArrayValue, addUniqueArrayValues } from "./utils/addUniqueArrayValue";
import parseLocationSearch from "./utils/parseLocationSearch";

export default function processUrlOptions() {
    var urlParams = parseLocationSearch(location.search);
    let url = window.asmUIURL + '?resourceId=';
    const configParams = {
        url,
        updateRate: window.UPDATE_RATE,
        initialViewLocation: window.INIT_VIEW_LOCATION,
        initialZoomLevel: parseInt(window.INIT_ZOOM_LEVEL),
        locationTypesConfig: JSON.parse(window.LOCATION_TYPES_CONFIG.replace(/&quot;/g,'"')),
        markerEntityTypes: [],
        polygonEntityTypes: [],
        zoomLevelTypeMap: {},
        popupIgnoreProperties: window.POPUP_IGNORE_PROPERTIES ? window.POPUP_IGNORE_PROPERTIES.split(',') : [],
        tooltipProperties: window.TOOLTIP_PROPERTIES ? window.TOOLTIP_PROPERTIES.split(',') : [],
        locationLimit: 1000,
        locationLinkTypes: window.LINK_TYPES ? window.LINK_TYPES.split(',') : [],
        linkColorProps:  window.LINK_COLOR_PROPS ? window.LINK_COLOR_PROPS.split(',') : [],
        affectedRadiusProps:  window.AFFECTED_RADIUS_PROPS ? window.AFFECTED_RADIUS_PROPS.split(',') : [],
        resourceId: '',
        groupIds: [],
        hideLinks: false,
        hideGeoBoundary: false,
        hideAffectedRadius: false,
        openWeatherMapApiId: '',
        returnComposites: window.RETURN_COMPOSITES,
    };

    // Build up zoomLevelTypeMap structure
    for(let i = 0; i <= 15; i++) {
        configParams.zoomLevelTypeMap[i] = {
            markerTypes: [],
            polygonTypes: [] 
        }
    }

    if (configParams.locationTypesConfig && configParams.locationTypesConfig.length) {
        for(let typeIndex = 0; typeIndex < configParams.locationTypesConfig.length; typeIndex++) {
            let def = configParams.locationTypesConfig[typeIndex];
            if (typeof def.minZoom === undefined) {
                def.minZoom = 0;
            }
            if (typeof def.maxZoom === undefined) {
                def.maxZoom = 15;
            }

            // Default non group types to markers
            if(def.vertexType !== 'group' && typeof def.locationStyle === undefined) {
                def.locationStyle = 'marker';
            }

            if (def && typeof def.minZoom !== undefined && typeof def.maxZoom !== undefined) {
                for(let i = def.minZoom; i <= def.maxZoom; i++) {
                    if (def.vertexType === 'group') {
                        if (def.locationStyle === 'marker') {
                            configParams.markerEntityTypes = addUniqueArrayValue(configParams.markerEntityTypes, def.entityType);
                            configParams.zoomLevelTypeMap[i].markerTypes = addUniqueArrayValue(configParams.zoomLevelTypeMap[i].markerTypes, def.entityType);
                        }
                        if (def.locationStyle === 'polygon') {
                            configParams.polygonEntityTypes = addUniqueArrayValue(configParams.polygonEntityTypes, def.entityType);
                            configParams.zoomLevelTypeMap[i].polygonTypes = addUniqueArrayValue(configParams.zoomLevelTypeMap[i].polygonTypes, def.entityType);
                        }
                        if (def.memberEntityTypes && Array.isArray(def.memberEntityTypes)) {
                            configParams.markerEntityTypes = addUniqueArrayValues(configParams.markerEntityTypes, def.memberEntityTypes);
                            configParams.zoomLevelTypeMap[i].markerTypes = addUniqueArrayValues(configParams.zoomLevelTypeMap[i].markerTypes, def.memberEntityTypes);
                        }
                    } else {
                        if (def.locationStyle === 'polygon') {
                            configParams.polygonEntityTypes = addUniqueArrayValue(configParams.polygonEntityTypes, def.entityType);
                            configParams.zoomLevelTypeMap[i].polygonTypes = addUniqueArrayValue(configParams.zoomLevelTypeMap[i].polygonTypes, def.entityType);
                        } else {
                            configParams.markerEntityTypes = addUniqueArrayValue(configParams.markerEntityTypes, def.entityType);
                            configParams.zoomLevelTypeMap[i].markerTypes = addUniqueArrayValue(configParams.zoomLevelTypeMap[i].markerTypes, def.entityType);
                        }
                    }
                }
            }
        }
    }
    
    if (urlParams && urlParams !== '') {
        if(urlParams['locationLimit'] && urlParams['locationLimit'] != '') {
            configParams.locationLimit = urlParams.locationLimit;
        }
        
        if(urlParams['locationLinkTypes'] && urlParams['locationLinkTypes'] != '') {
            configParams.locationLinkTypes = urlParams.locationLinkTypes.split(',');
        }

        if(urlParams['tooltipProperties'] && urlParams['tooltipProperties'] != '') {
            configParams.tooltipProperties = urlParams.tooltipProperties.split(',');
        }

        if(urlParams['resourceId'] && urlParams['resourceId'] != '') {
            configParams.resourceId = urlParams.resourceId;
        }

        if(urlParams['groupIds'] && urlParams['groupIds'] != '') {
            configParams.groupIds = urlParams.groupIds.split(',');
        }

        if(urlParams['hideLinks'] && urlParams['hideLinks'] != '' && urlParams['hideLinks'] === 'true') {
            configParams.hideLinks = true
        }
        if (urlParams['hideGeoBoundary'] && urlParams['hideGeoBoundary'] != '' && urlParams['hideGeoBoundary'] === 'true') {
            configParams.hideGeoBoundary = true;
        }
        if (urlParams['hideAffectedRadius'] && urlParams['hideAffectedRadius'] != '' && urlParams['hideAffectedRadius'] === 'true') {
            configParams.hideAffectedRadius = true;
        }
        if (urlParams['returnComposites'] && urlParams['returnComposites'] != '') {
            configParams.returnComposites = urlParams['returnComposites'];
        }

        if(urlParams['updateRate'] && urlParams['updateRate'] != '') {
            configParams.updateRate = urlParams.updateRate;
        }

        if(urlParams['initialViewLocation'] && urlParams['initialViewLocation'] != '') {
            configParams.initialViewLocation = urlParams.initialViewLocation;
        }

        if(urlParams['initialZoomLevel'] && urlParams['initialZoomLevel'] != '') {
            configParams.initialZoomLevel = parseInt(urlParams.initialZoomLevel);
        }

        if(urlParams['openWeatherMapApiId'] && urlParams['openWeatherMapApiId'] != '') {
            configParams.openWeatherMapApiId = urlParams.openWeatherMapApiId;
        }
    }

    console.log('Final configParams', configParams);
    return configParams;
}