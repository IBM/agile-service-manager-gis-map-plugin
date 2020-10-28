export default function getZoomLevel(view) {
    // Adjusted zoom level as min zoom 4 and max 19, config range 0 - 15 
   return view.map.getZoom() - 4;
}