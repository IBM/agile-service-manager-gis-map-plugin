// import plotAllGeoBoundaries from "./plotAllGeoBoundaries";
// import {plotAllLocations} from "./plotAllLocations";
import { addMarker } from "./marker";
import getProvidedValue from "./utils/getProvidedValue";
import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';
import { createGridTypeLayer } from "./createGridTypeLayer";
import fitMap from "./fitMap";

let intervalId = null;
// Used to show caching
const showDataTileCache = true;

export default function loadMapLocations(view) {
    const setUpGridTiles = function() {
        if (Object.keys(view.configParams.zoomTypeMap).length) {
            for(let type in view.configParams.zoomTypeMap) {
                view.gridCache[type] = createGridTypeLayer({view, type, showDataTileCache});
            }
        } else {
            view.configParams.locationTypes.forEach(type => {
                view.gridCache[type] = createGridTypeLayer({view, type, showDataTileCache});
            });
            view.configParams.locationGroupTypes.forEach(type => {
                view.gridCache[type] = createGridTypeLayer({view, type, showDataTileCache, isGroupType: true});
            })
            
        }
    };

    view.loadingInstance.set(true);
   
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
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

                // TODO handle these correctly
                // plotAllLocations(view, true);
                // plotAllGeoBoundaries(view, true);
                setUpGridTiles();
            }
        }).catch(function(err) {
            console.error(`Failed to request resourceId ${view.configParams.resourceId} data: ${err}`);
            // plotAllLocations(view);
            // plotAllGeoBoundaries(view);
            setUpGridTiles();
        })
    } else {
        setUpGridTiles();
    }
    

    intervalId = setInterval(function(){
        console.log('Clear marker cache');
        view.gridCache = {};
    }, view.configParams.updateRate);
}
