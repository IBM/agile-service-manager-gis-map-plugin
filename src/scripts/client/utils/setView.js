import findLocationType from "./findLocationType";
import getLocationLatLng from "./getLocationLatLng";

export function setViewToLocation({view, location, useMaxZoom}) {
    let type = findLocationType({view, location});
    let typeZoomLevel = findTypeZoomLevel({view, type, useMaxZoom});
    view.map.setView(getLocationLatLng(location), typeZoomLevel ? typeZoomLevel + 4 : view.currentZoomLevel + 4);
}

export function setViewToMarker({view, type, latlng, useMaxZoom}) {
    let typeZoomLevel = findTypeZoomLevel({view, type, useMaxZoom});
    
    view.map.setView(latlng, typeZoomLevel ? typeZoomLevel + 4 : view.currentZoomLevel + 4);
}

function findTypeZoomLevel({view, type, useMaxZoom}) {
    let typeZoomLevel = null;
    if (!useMaxZoom && (view.configParams.zoomLevelTypeMap[view.currentZoomLevel].markerTypes.includes(type) ||
        view.configParams.zoomLevelTypeMap[view.currentZoomLevel].markerTypes.includes(type))) {
        typeZoomLevel = view.currentZoomLevel;
    } else {
        for(let i = 15; i > 0 && typeZoomLevel === null; i--) {
            if (view.configParams.zoomLevelTypeMap[i].markerTypes.includes(type) ||
            view.configParams.zoomLevelTypeMap[i].markerTypes.includes(type)) {
                typeZoomLevel = i;
            }
        }
    }
    return typeZoomLevel;
}