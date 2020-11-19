export default function updateUrl({view}) {
    var queryParams = new URLSearchParams(window.location.search);
    const center = view.map.getCenter();
    queryParams.set("zoomLevel", view.currentZoomLevel);
    queryParams.set("viewLocation", `${center.lat.toFixed(4)},${center.lng.toFixed(4)}`);   
    // history.pushState(null, null, "?"+queryParams.toString());
    history.replaceState(null, null, "?"+queryParams.toString());
}