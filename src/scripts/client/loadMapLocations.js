import plotAllGeoBoundaries from "./plotAllGeoBoundaries";
import plotAllLocations from "./plotAllLocations";
import fitMap from "./fitMap";
import { addMarker } from "./marker";
import getProvidedValue from "./utils/getProvidedValue";
import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';

export default function loadMapLocations(view) {
    if (view.configParams.resourceId) {
        let url = '/proxy_service/topology/resources/' + view.configParams.resourceId + '?_include_status_severity=true';

        fetch(url)
        .then(function(response) {
            return response.json()
        }).then(function(data) {
            if (getProvidedValue(view.configParams.latProps, data) &&
                getProvidedValue(view.configParams.longProps, data)) {
                addMarker(view, data.entityTypes[0], data);
                // Zoom to marker
                fitMap(view);
                view.loadingInstance.set(false);
                plotAllLocations(view, true);
                plotAllGeoBoundaries(view, true);
            }
        }).catch(function(err) {
            console.error(`Failed to request resourceId ${view.configParams.resourceId} data: ${err}`);
            plotAllLocations(view);
            plotAllGeoBoundaries(view);
        })
    } else {
        view.loadingInstance.set(true);
        plotAllLocations(view);
        plotAllGeoBoundaries(view);
    }

    setInterval(function(){
        console.log('Fetch Marker data');
        plotAllLocations(view, true);
        plotAllGeoBoundaries(view, true);
    }, view.configParams.updateRate);
}
