import plotAllGeoBoundaries from "./plotAllGeoBoundaries";
import plotAllLocations from "./plotAllLocations";
import $ from 'jquery';
import fitMap from "./fitMap";
import { addMarker } from "./marker";
import getProvidedValue from "./utils/getProvidedValue";

export default function loadMapLocations(view) {
    if (view.configParams.resourceId) {
        let url = '/proxy_service/topology/resources/' + view.configParams.resourceId + '?_include_status_severity=true';

        $.get(url, (data, status) => {
            if (status === 'success' && getProvidedValue(view.configParams.latProps, data) &&
                getProvidedValue(view.configParams.longProps, data)) {
                addMarker(view, data.entityTypes[0], data);
                // Zoom to marker
                fitMap(view);
                view.loadingInstance.set(false);
                plotAllLocations(view, true);
                plotAllGeoBoundaries(view, true);
            }
        }).fail(function() {
            plotAllLocations(view);
            plotAllGeoBoundaries(view);
        });
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
