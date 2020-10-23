import parseLocationSearch from "./utils/parseLocationSearch";

export default function processUrlOptions() {
    var urlParams = parseLocationSearch(location.search);
    let url = window.asmUIURL + '?resourceId=';
    const configParams = {
        url,
        locationTypes: window.LOCATION_TYPES ? window.LOCATION_TYPES.split(',') : [],
        locationGroupTypes: window.LOCATION_GROUP_TYPES ? window.LOCATION_GROUP_TYPES.split(',') : [],
        geoBoundaryTypes: window.BOUNDARY_TYPES ? window.BOUNDARY_TYPES.split(',') : [],
        boundaryProps: window.BOUNDARY_PROPS ? window.BOUNDARY_PROPS.split(',') : [],
        longProps: window.LONG_PROPS ? window.LONG_PROPS.split(',') : [],
        latProps: window.LAT_PROPS ? window.LAT_PROPS.split(',') : [],
        updateRate: window.UPDATE_RATE,
        initialViewLocation: window.INIT_VIEW_LOCATION,
        initialZoomLevel: window.INIT_ZOOM_LEVEL,
        zoomTypeMap: JSON.parse(window.ZOOM_TYPE_MAP.replace(/&quot;/g,'"')),
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
        useViewPortFiltering: window.USE_VIEW_PORT_FILTERING === 'true'
    };

    if (urlParams && urlParams !== '') {
        if(urlParams['locationTypes'] && urlParams['locationTypes'] != '') {
            configParams.locationTypes = urlParams.locationTypes.split(',');
        }

        if(urlParams['locationGroupTypes'] && urlParams['locationGroupTypes'] != '') {
            configParams.locationGroupTypes = urlParams.locationGroupTypes.split(',');
        }

        if(urlParams['geoBoundaryTypes'] && urlParams['geoBoundaryTypes'] != '') {
            configParams.geoBoundaryTypes = urlParams.geoBoundaryTypes.split(',');
        }

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
            configParams.initialZoomLevel = urlParams.initialZoomLevel;
        }

        if(urlParams['openWeatherMapApiId'] && urlParams['openWeatherMapApiId'] != '') {
            configParams.openWeatherMapApiId = urlParams.openWeatherMapApiId;
        }
    }

    return configParams;
}