import L from 'leaflet';
import bboxPolygon from '@turf/bbox-polygon';

export default function getLocationPolygonLatLng(location) {
    if (location && location.geolocation) {
        if(location.geolocation.geotype === 'box') {
            const boxPolygon = bboxPolygon([
                location.geolocation.northEastLatitude,
                location.geolocation.northEastLongitude,
                location.geolocation.southWestLatitude,
                location.geolocation.soutWestLongitude
            ]);
            return boxPolygon.geometry.coordinates;
        } else {
            return new L.LatLng(location.geolocation.latitude, location.geolocation.longitude);
        }
    }
    return;
}