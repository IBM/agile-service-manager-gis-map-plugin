/**
 * This module defines a router handler for HTML template files.
 *
 * @module templateRouter
 */

var express = require('express');
var router = express.Router();
var config = require('./config').readConfig();

// Inject config file/env values into the index HTML file's {{field}} placeholders.
function renderTemplate(fileName, request, response) {
    response.render(fileName, {
        'popupIgnoreProperties': config.popupIgnoreProperties,
        'tooltipProperties': config.tooltipProperties,
        'asmUIURL': '' + config.asmUIURL,
        'locationEntityTypes': config.locationEntityTypes,
        'boundaryEntityTypes': config.boundaryEntityTypes,
        'boundaryPropertyNames': config.boundaryPropertyNames,
        'longitudePropertyNames': config.longitudePropertyNames,
        'latitudePropertyNames': config.latitudePropertyNames,
        'linkEdgeTypes': config.linkEdgeTypes,
        'linkColorPropertyNames': config.linkColorPropertyNames,
        'affectedRadiusPropertyNames': config.affectedRadiusPropertyNames,
        'updateRate': config.updateRate
    });
}
// Handle the root URL
router.get('/', function(request, response) {
    renderTemplate('index', request, response);
});

module.exports = router;
