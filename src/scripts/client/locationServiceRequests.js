import { addLinks } from "./links";
import { addLocationToMap } from "./plotAllLocations";

export function baseLocationServiceRequest({view, locationTypeConfig, geoBounds, url, processFeature}) {
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
    fetch(url)
    .then(function(response) {
        return response.json()
    }).then(function(data) {
        if (data && data.features && Array.isArray(data.features)) {
            data.features.forEach((feature) => {
                processFeature(feature);
            });
        }
        locationTypeRequestComplete();
    }).catch(function(err) {
        console.error(`Failed to request ${url} data: ${err}`);
        locationTypeRequestComplete();
    })
}

function getPostGisGeoBounds({geoBounds}) {
    if (geoBounds) {
        return '&lngMin=' + geoBounds._southWest.lng + '&latMin=' + geoBounds._southWest.lat +
                '&lngMax=' + geoBounds._northEast.lng + '&latMax=' + geoBounds._northEast.lat;
    }
    return ''
}

export function getLocationsPostGis({view, locationTypeConfig, geoBounds}) {
    const url = '/location_service/sites-roll?entityType=' + locationTypeConfig.entityType + getPostGisGeoBounds({geoBounds});
    const processFeature =  function(feature) {
        if (feature && feature.properties && feature.geometry) {
            const location = {...feature.properties, ...{geometry: feature.geometry}};
            addLocationToMap({view, locationTypeConfig, location})
        }
    };
    baseLocationServiceRequest({view, locationTypeConfig, geoBounds, url, processFeature});
}

export function getLocationsPostGisTag({view, locationTypeConfig, geoBounds}) {
    const url = '/location_service/tag-roll?tag=' + locationTypeConfig.tag + getPostGisGeoBounds({geoBounds});
    const processFeature =  function(feature) {
        if (feature && feature.properties && feature.geometry) {
            const location = {
                ...feature.properties,
                ...{
                    geometry: feature.geometry,
                    _id: feature.properties.name, 
                    entityTypes: locationTypeConfig.entityType,
                    name: feature.properties.name.replace(locationTypeConfig.tag.replace('%', ''), ''),
                }};
            addLocationToMap({view, locationTypeConfig, location, aggreationZoomLevel: locationTypeConfig.aggreationZoomLevel || null})
        }
    };
    baseLocationServiceRequest({view, locationTypeConfig, geoBounds, url, processFeature});
}


export function getLocationsPostGisProvince({view, locationTypeConfig, geoBounds}) {
    const url = '/location_service/provinces-roll?' + getPostGisGeoBounds({geoBounds});
    const processFeature =  function(feature) {
        if (feature && feature.properties && feature.geometry) {
            const location = {...feature.properties, ...{geometry: feature.geometry, _id: feature.properties.name, entityTypes: locationTypeConfig.entityType}};
            addLocationToMap({view, locationTypeConfig, location, aggreationZoomLevel: locationTypeConfig.aggreationZoomLevel || null})
        }
    };
    baseLocationServiceRequest({view, locationTypeConfig, geoBounds, url, processFeature});
}