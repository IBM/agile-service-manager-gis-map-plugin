import findLocationType from "./findLocationType";
import getLocationLatLng from "./getLocationLatLng";

export default function setViewToLocation({view, location}) {
    let type = findLocationType({view, location});
    let typeZoomLevel = null;
    if (view.configParams.zoomLevelTypeMap[view.currentZoomLevel].markerTypes.includes(type) ||
        view.configParams.zoomLevelTypeMap[view.currentZoomLevel].markerTypes.includes(type)) {
        typeZoomLevel = view.currentZoomLevel;
    } else {
        for(let i = 15; i > 0 && typeZoomLevel === null; i--) {
            if (view.configParams.zoomLevelTypeMap[i].markerTypes.includes(type) ||
            view.configParams.zoomLevelTypeMap[i].markerTypes.includes(type)) {
                typeZoomLevel = i;
            }
        }
    }
    view.map.setView(getLocationLatLng(location), typeZoomLevel ? typeZoomLevel + 4 : view.currentZoomLevel + 4);
}