import L from 'leaflet';
import fitMap from './fitMap';

export default function createSearchControl(view) {
    const searchLayers = [];
    Object.keys(view.markerTypes).forEach(type => {
        searchLayers.push(view.markerTypes[type].clusterGroup);
    })
    const searchControl = L.control.search({
        layer: L.layerGroup(searchLayers),
        marker: false,
        moveToLocation: function (latlng, title, map) {
            map.setView(latlng, 16); // access the zoom
            latlng.layer.openPopup();
            view.clusterGroup.zoomToShowLayer(latlng, () => {
                latlng.openPopup();
            })
        }
    });

    searchControl.on('search:locationfound', function (e) {
        view.map.setView(e.latlng, 16);
        if (e.layer._popup)
            e.layer.openPopup();
    }).on('search:collapsed', function () {
        fitMap(view);
    });
    return searchControl;
}