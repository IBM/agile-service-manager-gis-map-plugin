export default function fitMap(view) {
    try {
        view.map.fitBounds(view.clusterGroup.getBounds());
    }
    catch (e) {
        // Do nothing if this fails
    }
}
    
