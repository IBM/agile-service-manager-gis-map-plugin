import { severityRank } from "./utils/status";
import 'leaflet.markercluster.layersupport';
import L from 'leaflet';
import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';

function getMarkerCss(markers) {
    let max = 0;
    for (var i = 0; i < markers.length; i++) {
        if (max === 7) {
            break; // no point going any further
        }
        if (markers[i].getPopup() && markers[i].getPopup()._source.feature.properties.state) {
            if (severityRank[markers[i].getPopup()._source.feature.properties.state] > max) {
                max = severityRank[markers[i].getPopup()._source.feature.properties.state];
            }
        }
    }
    //alert(max);
    return 'leaflet-marker-icon marker-cluster marker-cluster-' + max + ' leaflet-zoom-animated leaflet-interactive';
}

export default function createClusterGroup(map, config) {
    var clusterGroup = L.markerClusterGroup.layerSupport({
        iconCreateFunction: function (cluster) {
            var childCount = cluster.getChildCount();
            var css = getMarkerCss(cluster.getAllChildMarkers());
            let iconSize = 40; // by default
            if (childCount < 10) {
                iconSize = 40;
            } else if (childCount < 100) {
                iconSize = 40;
            } else {
                iconSize = 40;
            }
            return new L.DivIcon({
                html: '<div class="leaflet-marker-icon marker-cluster marker-cluster-small leaflet-zoom-animated leaflet-interactive"><span>' + childCount + '</span></div>',
                className: css,
                iconSize: new L.Point(iconSize, iconSize)
            });
        },
        spiderfyOnMaxZoom: true,
        maxClusterRadius: 80
    });

    clusterGroup.on('click', function (marker) {
        let url = '/proxy_service/topology/resources/' + marker.sourceTarget.feature.properties.id + '?_follow_composites=true&_include_status=true';

        fetch(url)
        .then(function(response) {
            return response.json()
        }).then(function(data) {
            if (data.hasOwnProperty('uniqueId')) {
                let tmpUrl = marker.sourceTarget.feature.properties.url;
                tmpUrl = tmpUrl.replace('{RESOURCE_ID}', marker.sourceTarget.feature.properties.id);
                let tooltipContent = '<div style="width:auto">';
                let stateimage = '<img src="/markers/marker-' + marker.sourceTarget.feature.properties.state + '.svg" style="width:20px; height:20px" type="image/svg" title="State: ' + marker.sourceTarget.feature.properties.state + '">';
                tooltipContent += '<h3>' + data.name + ' ' + stateimage + '</h3><h6> ' + data.entityTypes.toString() + '</h6><a class="bx--link asm_link" href="' + tmpUrl + '" target="asmTopology">View in ASM topology viewer</a>';
                tooltipContent += '<h3>Properties</h3>'
                tooltipContent += '<table border="1" class="tooltipTable"><tr><th class="tooltip_key">Attribute</th><th class="tooltipTableCell">Value</th></tr>';

                // sort te entries so the table displays nicely...
                for (var key in Object.entries(data).sort().reduce((o, [k, v]) => (o[k] = v, o), {})) {
                    if (!data.hasOwnProperty(key)) continue;
                    if (key !== 'name' && key !== 'entityTypes' && config.popupIgnoreProperties.indexOf(key) === -1) {
                        tooltipContent += '<tr valign="middle"><td class="tooltip_key">' + key + '</td><td class="tooltipTableCell">' + data[key] + '</td></tr>';
                    }
                }
                tooltipContent += '</table>'
                if (data && data._status && Array.isArray(data._status) && data._status.length) {
                    tooltipContent += '</br><h3>Status details</h3>'
                    tooltipContent += '<table border="1" class="tooltipTable"><tr><th class="tooltip_key" colSpan="2">Severity</th><th class="tooltipTableCell">Status</th></tr>';
                    data._status.forEach( status => {
                        tooltipContent += '<tr valign="middle"><td class="tooltip_key_icon"><img src="/markers/' + status.severity + '.svg" style="width:20px; height:20px" type="image/svg" title="State: ' + status.severity + '"></td>' +
                        '<td class="tooltip_key">' + status.severity + '</td>' +
                        '<td class="tooltipTableCell">' + status.description + '</td></tr>';
                    })
                    tooltipContent += '</table>'
                }

                tooltipContent += '</div>'
                L.popup({'maxWidth': '1500'}).setLatLng(marker.latlng).setContent(tooltipContent).openOn(map);
            }
        }).catch(function(err) {
            console.error(`Failed to request ${marker.sourceTarget.feature.properties.id} data: ${err}`);
        });
    });

    clusterGroup.on('clustermouseover', function (c) {
        L.popup().setLatLng(c.layer.getLatLng())
            .setContent(c.layer.getAllChildMarkers().length + ' Locations (click to Zoom)')
            .openOn(map);
    }).on('clustermouseout', function () {
        map.closePopup();
    }).on('clusterclick', function () {
        map.closePopup();
    });


    return clusterGroup;
}