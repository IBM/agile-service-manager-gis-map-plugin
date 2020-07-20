import { severityRank, propertySortLowToHigh } from './utils/status';
import fitMap from './fitMap';
import { addBoundary } from './boundary';
import addUrlParams from './utils/addUrlParams';
import getProvidedValue from './utils/getProvidedValue';
import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';

// create a panel
// https://leafletjs.com/examples/map-panes/

export default function plotALlGeoBoundaries(view, maintainZoom) {
    if (!maintainZoom) {
        view.loadingInstance.set(true);
    }
    
    const config = view.configParams;

    if (config.geoBoundaryTypes.length && !config.hideGeoBoundary) {
        getAllLocations(view);
    }

    function getAllLocations(view) {
        const geoBoundaryTypesArray = config.geoBoundaryTypes;
        const boundaryTypesRequests = {};
        const foundBoundaries = [];
        geoBoundaryTypesArray.forEach( boundaryType => {
            boundaryTypesRequests[boundaryType] = false;
        });

        const boundaryTypesRequestComplete = (boundaryType) => {
            boundaryTypesRequests[boundaryType] = true;
            if (Object.values(boundaryTypesRequests).every( v => v)) {
                foundBoundaries.sort(propertySortLowToHigh('_hasStatus', severityRank));
                if (view.boundaryTypes[boundaryType].clusterGroup && typeof view.boundaryTypes[boundaryType].clusterGroup.clearLayers === 'function') {
                    view.boundaryTypes[boundaryType].clusterGroup.clearLayers();
                }
                foundBoundaries.forEach(location => {
                    addBoundary(view, boundaryType, location);
                })
                
                if(!maintainZoom) {
                    fitMap(view)
                }
                view.loadingInstance.set(false);
            }
        }

        let baseUrl = '/proxy_service/topology/resources?' +
        '&_return_composites=' + config.returnComposites +
        '&_field=name' +
        '&_field=entityTypes' +
        '&_limit=' + config.locationLimit +
        '&_include_status_severity=true'

        baseUrl = addUrlParams(baseUrl, config.boundaryProps, '_field');
        baseUrl = addUrlParams(baseUrl, config.tooltipProperties, '_field');

        geoBoundaryTypesArray.forEach( boundaryType => {
            let url = baseUrl + 
            '&_type=' + boundaryType;

            fetch(url)
            .then(function(response) {
                return response.json()
            }).then(function(data) {
                if (data.hasOwnProperty('_items')) {
                    data._items.forEach((location) => {
                        const boundaryPropValue = getProvidedValue(view.configParams.boundaryProps, location);
                        if (boundaryPropValue && Array.isArray(boundaryPropValue)) {
                            foundBoundaries.push(location);
                        }
                    })
                }
                boundaryTypesRequestComplete(boundaryType);
            }).catch(function(err) {
                console.error(`Failed to request boundaryType ${boundaryType} data: ${err}`);
                boundaryTypesRequestComplete(boundaryType);
            })
        }) 
    }
}