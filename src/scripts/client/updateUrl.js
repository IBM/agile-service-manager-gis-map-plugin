export default function updateUrl({view}) {
    var queryParams = new URLSearchParams(window.location.search);
    const center = view.map.getCenter();
    queryParams.set("zoomLevel", view.currentZoomLevel);
    queryParams.set("viewLocation", `${center.lat},${center.lng}`);   
    history.pushState(null, null, "?"+queryParams.toString());
}