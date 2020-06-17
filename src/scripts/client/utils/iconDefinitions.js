let clearMarkerIcon = '<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><path fill="{mapIconColor}" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#ffffff" cx="74" cy="75" r="61"/><circle fill="{mapIconColorInnerCircle}" cx="74" cy="75" r="{pinInnerCircleRadius}"/><svg viewBox="-11.3 -6 55 55" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="0.1" fill="none" fill-rule="evenodd"><rect fill="#24A148" x="3" y="3" width="26" height="26" rx="2"></rect><polygon fill="#FFFFFF" points="14 21.5 9 16.5 10.59 15 14 18.35 21.41 11 23 12.58"></polygon></g></svg></svg>';
let criticalMarkerIcon = '<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><path fill="{mapIconColor}" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#ffffff" cx="74" cy="75" r="61"/><circle fill="{mapIconColorInnerCircle}" cx="74" cy="75" r="{pinInnerCircleRadius}"/><svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.3 -6 55 55"><path fill="#da1e28" d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14 14-6.2 14-14S23.8 2 16 2zm5.4 21L9 10.6 10.6 9 23 21.4 21.4 23z"/><path d="M21.4 23L9 10.6 10.6 9 23 21.4 21.4 23z" opacity="0"/></svg></svg>';
let fatalMarkerIcon = '<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><path fill="{mapIconColor}" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#ffffff" cx="74" cy="75" r="61"/><circle fill="{mapIconColorInnerCircle}" cx="74" cy="75" r="{pinInnerCircleRadius}"/><svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.3 -6 55 55"><path d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2zm5.4 21L16 17.6 10.6 23 9 21.4l5.4-5.4L9 10.6 10.6 9l5.4 5.4L21.4 9l1.6 1.6-5.4 5.4 5.4 5.4-1.6 1.6z"/><path d="M21.4 23L16 17.6 10.6 23 9 21.4l5.4-5.4L9 10.6 10.6 9l5.4 5.4L21.4 9l1.6 1.6-5.4 5.4 5.4 5.4-1.6 1.6z" opacity="0"/></svg></svg>';
let indeterminateMarkerIcon = '<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><path fill="{mapIconColor}" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#ffffff" cx="74" cy="75" r="61"/><circle fill="{mapIconColorInnerCircle}" cx="74" cy="75" r="{pinInnerCircleRadius}"/><svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.3 -6 55 55"><path fill="#4F2196" d="M29.416 14.59L17.41 2.585a1.994 1.994 0 0 0-2.82 0L2.585 14.59a1.993 1.993 0 0 0 0 2.819L14.59 29.416a1.994 1.994 0 0 0 2.819 0L29.416 17.41a1.993 1.993 0 0 0 0-2.82zM21 18H11v-4h10z"/><path d="M11 14h10v4H11z" opacity="0"/></svg></svg>';
let infoMarkerIcon = '<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><path fill="{mapIconColor}" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#ffffff" cx="74" cy="75" r="61"/><circle fill="{mapIconColorInnerCircle}" cx="74" cy="75" r="{pinInnerCircleRadius}"/><svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.3 -6 55 55"><path fill="#3151b7" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 5a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 16 7zm4 17.12h-8v-2.24h2.88v-6.76H13v-2.24h4.13v9H20z" /></svg></svg>';
let majorMarkerIcon = '<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><path fill="{mapIconColor}" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#ffffff" cx="74" cy="75" r="61"/><circle fill="{mapIconColorInnerCircle}" cx="74" cy="75" r="{pinInnerCircleRadius}"/><svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.3 -9 55 55"><path fill="#fc991e" d="M29.86 2.49A1 1 0 0 0 29 2H3a1.002 1.002 0 0 0-.88 1.478l13 25.037a1.04 1.04 0 0 0 1.759 0l13-25.037a1.003 1.003 0 0 0-.02-.989zM14.874 5h2.25v10h-2.25zM16 21a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 21z"/><path d="M14.875 5h2.25v10h-2.25zM16 21a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 21z" opacity="0"/></svg></svg>';
let minorMarkerIcon = '<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><path fill="{mapIconColor}" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#ffffff" cx="74" cy="75" r="61"/><circle fill="{mapIconColorInnerCircle}" cx="74" cy="75" r="{pinInnerCircleRadius}"/><svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.3 -4 55 55"><path fill="#fdd13a" d="M29.88 27.52l-13-25a1 1 0 0 0-1.76 0l-13 25a1 1 0 0 0 0 1A1 1 0 0 0 3 29h26a1 1 0 0 0 .86-.49 1 1 0 0 0 .02-.99zM14.88 10h2.25v10h-2.25zM16 26a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 26z"/><path d="M14.88 10h2.25v10h-2.25zM16 26a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 26z"/></svg></svg>';
let unknownMarkerIcon = '<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><path fill="{mapIconColor}" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#ffffff" cx="74" cy="75" r="61"/><circle fill="{mapIconColorInnerCircle}" cx="74" cy="75" r="{pinInnerCircleRadius}"/><svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.3 -6 55 55"><path fill="#8F8B8B" d="M29.416 14.59L17.41 2.585a1.994 1.994 0 0 0-2.82 0L2.585 14.591a1.994 1.994 0 0 0 0 2.819L14.59 29.416a1.994 1.994 0 0 0 2.819 0L29.416 17.41a1.994 1.994 0 0 0 0-2.82zM16 24a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 24zm1.125-6.752v1.877h-2.25V15H17a1.875 1.875 0 0 0 0-3.75h-2a1.877 1.877 0 0 0-1.875 1.875v.5h-2.25v-.5A4.13 4.13 0 0 1 15 9h2a4.125 4.125 0 0 1 .125 8.248z"/><path d="M16 21a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 16 21zm1.125-3.752A4.125 4.125 0 0 0 17 9h-2a4.13 4.13 0 0 0-4.125 4.125v.5h2.25v-.5A1.877 1.877 0 0 1 15 11.25h2A1.875 1.875 0 0 1 17 15h-2.125v4.125h2.25z" opacity="0"/></svg></svg>';
let warningMarkerIcon = '<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><path fill="{mapIconColor}" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="#ffffff" cx="74" cy="75" r="61"/><circle fill="{mapIconColorInnerCircle}" cx="74" cy="75" r="{pinInnerCircleRadius}"/><svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.3 -6 55 55"><path fill="#408BFC" d="M26.002 4H5.998A1.998 1.998 0 0 0 4 5.998v20.004A1.998 1.998 0 0 0 5.998 28h20.004A1.998 1.998 0 0 0 28 26.002V5.998A1.998 1.998 0 0 0 26.002 4zM14.875 8h2.25v10h-2.25zM16 24a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 24z"/><path d="M14.875 8h2.25v10h-2.25zM16 24a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 24z" opacity="0"/></svg></svg>';
import {
	divIcon,
	Util
} from 'leaflet';

export function getMarkerByState(severityText) {
	let icon = null;
	switch (severityText) {
		case 'clear':
			icon = divIcon({
				className: "leaflet-data-marker",
				html: Util.template(clearMarkerIcon, {
					mapIconColor: '#014a0b',
					mapIconColorInnerCircle: '#FFFFFF',
					pinInnerCircleRadius: 30
				}), //.replace('#','%23'),
				iconAnchor: [12, 32],
				iconSize: [36, 41],
				popupAnchor: [0, -28]
			});
			break;
		case 'critical':
			icon = divIcon({
				className: "leaflet-data-marker",
				html: Util.template(criticalMarkerIcon, {
					mapIconColor: '#FF0000',
					mapIconColorInnerCircle: '#FFFFFF',
					pinInnerCircleRadius: 30
				}), //.replace('#','%23'),
				iconAnchor: [12, 32],
				iconSize: [36, 41],
				popupAnchor: [0, -28]
			});
			break;
		case 'fatal':
			icon = divIcon({
				className: "leaflet-data-marker",
				html: Util.template(fatalMarkerIcon, {
					mapIconColor: '#FF0000',
					mapIconColorInnerCircle: '#FFFFFF',
					pinInnerCircleRadius: 30
				}), //.replace('#','%23'),
				iconAnchor: [12, 32],
				iconSize: [36, 41],
				popupAnchor: [0, -28]
			});
			break;
		case 'indeterminate':
			icon = divIcon({
				className: "leaflet-data-marker",
				html: Util.template(indeterminateMarkerIcon, {
					mapIconColor: '#542c7d',
					mapIconColorInnerCircle: '#FFFFFF',
					pinInnerCircleRadius: 30
				}), //.replace('#','%23'),
				iconAnchor: [12, 32],
				iconSize: [36, 41],
				popupAnchor: [0, -28]
			});
			break;
		case 'information':
			icon = divIcon({
				className: "leaflet-data-marker",
				html: Util.template(infoMarkerIcon, {
					mapIconColor: '#2c377d',
					mapIconColorInnerCircle: '#FFFFFF',
					pinInnerCircleRadius: 30
				}), //.replace('#','%23'),
				iconAnchor: [12, 32],
				iconSize: [36, 41],
				popupAnchor: [0, -28]
			});
			break;
		case 'major':
			icon = divIcon({
				className: "leaflet-data-marker",
				html: Util.template(majorMarkerIcon, {
					mapIconColor: '#FF6600',
					mapIconColorInnerCircle: '#FFFFFF',
					pinInnerCircleRadius: 30
				}), //.replace('#','%23'),
				iconAnchor: [12, 32],
				iconSize: [36, 41],
				popupAnchor: [0, -28]
			});
			break;
		case 'minor':
			icon = divIcon({
				className: "leaflet-data-marker",
				html: Util.template(minorMarkerIcon, {
					mapIconColor: '#d1c743',
					mapIconColorInnerCircle: '#FFFFFF',
					pinInnerCircleRadius: 30
				}), //.replace('#','%23'),
				iconAnchor: [12, 32],
				iconSize: [36, 41],
				popupAnchor: [0, -28]
			});
			break;
		case 'unknown':
			icon = divIcon({
				className: "leaflet-data-marker",
				html: Util.template(unknownMarkerIcon, {
					mapIconColor: '#180068',
					mapIconColorInnerCircle: '#FFFFFF',
					pinInnerCircleRadius: 30
				}), //.replace('#','%23'),
				iconAnchor: [12, 32],
				iconSize: [36, 41],
				popupAnchor: [0, -28]
			});
			break;
		case 'warning':
			icon = divIcon({
				className: "leaflet-data-marker",
				html: Util.template(warningMarkerIcon, {
					mapIconColor: '#475bd6',
					mapIconColorInnerCircle: '#FFFFFF',
					pinInnerCircleRadius: 30
				}), //.replace('#','%23'),
				iconAnchor: [12, 32],
				iconSize: [36, 41],
				popupAnchor: [0, -28]
			});
			break;
		default:
			icon = divIcon({
				className: "leaflet-data-marker",
				html: Util.template(unknownMarkerIcon, {
					mapIconColor: '#FF0000',
					mapIconColorInnerCircle: '#FFFFFF',
					pinInnerCircleRadius: 30
				}), //.replace('#','%23'),
				iconAnchor: [12, 32],
				iconSize: [36, 41],
				popupAnchor: [0, -28]
			});
			break;
	}
	return icon;
}

export const severityToIcon = {
	clear: getMarkerByState('clear'),
	critical: getMarkerByState('critical'),
	fatal: getMarkerByState('fatal'),
	indeterminate: getMarkerByState('indeterminate'),
	information: getMarkerByState('information'),
	major: getMarkerByState('major'),
	minor: getMarkerByState('minor'),
	unknown: getMarkerByState('unknown'),
	warning: getMarkerByState('warning')
}
