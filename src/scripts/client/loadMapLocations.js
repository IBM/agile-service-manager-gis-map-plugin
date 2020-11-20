import { addMarker } from "./marker";
import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';
import { createGridTypeLayer } from "./createGridTypeLayer";
import findLocationType from "./utils/findLocationType";
import {setViewToLocation} from "./utils/setView";

let intervalId = null;
// Used to show caching
const showDataTileCache = true;

export default function loadMapLocations(view) {
    const setUpGridTiles = function() {
        if (view.configParams.locationTypesConfig.length) {
            for(let i = 0; i < view.configParams.locationTypesConfig.length; i++) {
                const locationTypeConfig = view.configParams.locationTypesConfig[i];
                if (locationTypeConfig) {
                    view.gridCache[i] = createGridTypeLayer({view, locationTypeConfig, showDataTileCache});
                }
            }
        } else {
            console.error('No known location types');
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
            if (data.geolocation) {
                let type = findLocationType({view, location: data});
                addMarker(view, type, data);
                
                // Zoom to marker
                setViewToLocation({view, location: data, useMaxZoom: false});
                view.loadingInstance.set(false);
                setUpGridTiles();
            }
        }).catch(function(err) {
            console.error(`Failed to request resourceId ${view.configParams.resourceId} data: ${err}`);
            setUpGridTiles();
        })
    } else {
        setUpGridTiles();
    }
    

    intervalId = setInterval(function(){
        console.log('Clear marker cache');
        for(let cacheKey in view.gridCache) {
            view.gridCache[cacheKey].visitedArea = null;
        }
    }, view.configParams.updateRate);
}
