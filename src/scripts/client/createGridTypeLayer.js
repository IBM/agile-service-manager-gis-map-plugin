import bboxPolygon from '@turf/bbox-polygon';
import union from '@turf/union';
import booleanContains from '@turf/boolean-contains';
import L from 'leaflet';
import { getGridTileLocations } from './plotAllLocations';

export function createGridTypeLayer({view, type, showDataTileCache}) {
    const map = view.map;
    let visitedArea = null;
    
    const typeConfig = view.configParams.zoomTypeMap[type] || {};

    var tiles = new L.GridLayer({
        tileSize: 512,
        // tileSize: 1024,
        // Adjusted zoom level as min zoom 4 and max 19, config range 0 - 15 
        maxZoom: typeConfig.maxZoom ? typeConfig.maxZoom + 4 : 19,
        minZoom: typeConfig.minZoom ? typeConfig.minZoom + 4 : 4,
    });

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
                }
            };
            if (typeConfig.locationTypes) {
                tileLocationsDataConfig.groupType = type;
            } else {
                tileLocationsDataConfig.locationType = type;
            }
            const gridPolygon = bboxPolygon([nw.lat, nw.lng, se.lat, se.lng]);
            if (visitedArea) {
                if (booleanContains(visitedArea, gridPolygon)) {
                    cachedTile = true;
                } else {
                    // Add to visted area
                    const calculatedUnion = union(visitedArea, gridPolygon);
                    if (calculatedUnion && calculatedUnion.geometry.type === 'Polygon') {
                        visitedArea = calculatedUnion;
                        // Fetch the data for this tile here
                        console.log('fetch data for tile', type);
                        getGridTileLocations(tileLocationsDataConfig);
                    }
                }
            } else {
                visitedArea = gridPolygon;
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
}

