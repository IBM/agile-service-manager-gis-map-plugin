import L from 'leaflet';
import bboxPolygon from '@turf/bbox-polygon';
import centroid from '@turf/centroid';

export default function getLocationLatLng(location) {
    if (location && location.geometry) {
        if (location.geometry.type === 'Point') {
            return new L.LatLng(location.geometry.coordinates[1], location.geometry.coordinates[0]);
        }
    }
    if (location && location.geolocation) {
        if(location.geolocation.geotype === 'box') {
            const boxPolygon = bboxPolygon([
                location.geolocation.northEastLatitude,
                location.geolocation.northEastLongitude,
                location.geolocation.southWestLatitude,
                location.geolocation.soutWestLongitude
            ]);
            const boxCentrePoint = centroid(boxPolygon);
            return new L.LatLng(...boxCentrePoint.geometry.coordinates);
        } else {
            return new L.LatLng(location.geolocation.latitude, location.geolocation.longitude);
        }
    }
    return;
}