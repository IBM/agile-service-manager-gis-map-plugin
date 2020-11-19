import getProvidedValue from "./utils/getProvidedValue";
import L from 'leaflet';
export function addLinks(view) {
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
}