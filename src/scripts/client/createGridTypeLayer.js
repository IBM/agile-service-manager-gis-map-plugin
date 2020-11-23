import bboxPolygon from '@turf/bbox-polygon';
import union from '@turf/union';
import {polygon} from '@turf/helpers';
import booleanContains from '@turf/boolean-contains';
import L from 'leaflet';
import { getGridTileLocations } from './plotAllLocations';

function isCached (visitedArea, gridPolygon) {
    if (visitedArea.geometry.type === 'Polygon') {
        return booleanContains(visitedArea, gridPolygon);
    } else if (visitedArea.geometry.type === 'MultiPolygon') {
        let cached = false;
        for(let i = 0; i < visitedArea.geometry.coordinates.length && !cached; i++) {
            cached = booleanContains(polygon(visitedArea.geometry.coordinates[i]), gridPolygon);
        }
        return cached;
    }
    return false;
}

export function createGridTypeLayer({view, locationTypeConfig, showDataTileCache}) {
    const map = view.map;
    
    var tiles = new L.GridLayer({
        // tileSize: 512,
        // tileSize: 1024,
        // tileSize: 2048,
        tileSize: 4096,
        // Adjusted zoom level as min zoom 4 and max 19, config range 0 - 15 
        maxZoom: locationTypeConfig.maxZoom ? locationTypeConfig.maxZoom + 4 : 19,
        minZoom: locationTypeConfig.minZoom ? locationTypeConfig.minZoom + 4 : 4,
    });

    const instance = {
        visitedArea: null,
        tiles
    };

    tiles.createTile = function(coords) {
        var size = this.getTileSize()
        
        // calculate projection coordinates
        var nwPoint = coords.scaleBy(size)
        var sePoint = {
            x: nwPoint.x + size.x,
            y: nwPoint.y + size.y
        };
        var swPoint = {
            x: nwPoint.x,
            y: nwPoint.y + size.y
        }

        var nePoint = {
            x: nwPoint.x + size.x,
            y: nwPoint.y
        }
        
        // calculate geographic coordinates
        var nw = map.unproject(nwPoint, coords.z)
        var se = map.unproject(sePoint, coords.z)
        var sw = map.unproject(swPoint, coords.z)
        var ne = map.unproject(nePoint, coords.z)


        let cachedTile = false;
        // Get polygon for current tile
        try {
            const tileLocationsDataConfig = {
                view, 
                geoBounds: {
                    _southWest: {
                        lat: sw.lat,
                        lng: sw.lng
                    },
                    _northEast: {
                        lat: ne.lat,
                        lng: ne.lng
                    }
                },
                locationTypeConfig
            };
            
            const gridPolygon = bboxPolygon([nw.lat, nw.lng, se.lat, se.lng]);
            if (instance.visitedArea) {
                if (isCached(instance.visitedArea, gridPolygon)) {
                    cachedTile = true;
                } else {
                    // Add to visted area
                    const calculatedUnion = union(instance.visitedArea, gridPolygon);
                    if (calculatedUnion && (calculatedUnion.geometry.type === 'Polygon' || calculatedUnion.geometry.type === 'MultiPolygon')) {
                        instance.visitedArea = calculatedUnion;
                        // Fetch the data for this tile here
                        showDataTileCache && console.log('fetch data for tile', locationTypeConfig);
                        getGridTileLocations(tileLocationsDataConfig);
                    }
                }
            } else {
                instance.visitedArea = gridPolygon;
                getGridTileLocations(tileLocationsDataConfig);
            }
        } catch (error) {
            // Catch boundary errors, when user leaves map area
            console.error(error)
        }
        
        var tile = L.DomUtil.create('canvas', 'leaflet-tile');

        // Data viz to show how grid is loaded
        if (showDataTileCache) {
            tile.width = size.x
            tile.height = size.y
            var ctx = tile.getContext('2d');
            if (!cachedTile) {
                // Mark where data load happens
                L.circle(nw, {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: 50
                }).addTo(map);
        
                L.circle(se, {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: 50
                }).addTo(map)
            }
            
            // Show blue if using cached tile area
            ctx.strokeStyle = cachedTile ? 'blue' : 'red';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(size.x-1, 0);
            ctx.lineTo(size.x-1, size.y-1);
            ctx.lineTo(0, size.y-1);
            ctx.closePath();
            ctx.stroke();
            
        }
        return tile;
    }

    tiles.addTo(map);
    return instance;
}

