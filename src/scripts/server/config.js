/**
 * Stores configuration settings for the runtime environment. <br>
 *
 * Configuration is obtained from two places: a YAML config file, and from
 * environment variables, with the latter taking precedence. <br>
 *
 * When configuration needs to be read initially, the "readConfig" method
 * should be used. Thereafter, unless the config needs to be re-read, other
 * modules need only use the "settings" variable in order to access the
 * configuration settings.
 *
 * @module config
 */

var yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');


// Configuration settings for the application
var settings = {};


/**
 * Returns defaults for all configuration settings.
 *
 * @return   {Object}   An object containing default settings
 * @private
 */
function getDefaults() {
    return {
        'webServerPort': 3000,
        'webServerSecurePort': 3443,
        'proxyServiceHost': 'localhost',
        'proxyServicePort': 443,
        'proxyServiceTenantId': 'cfd95b7e-3bc7-4006-a4a8-a73a79c71255',
        'proxyServiceUsername': 'asm',
        'proxyServicePassword': 'asm',
        'proxyServiceRootPath': '/1.0/',
        'asmUIURL': 'https://localhost/aiops/cfd95b7e-3bc7-4006-a4a8-a73a79c71255/topology-viewer?resourceId={RESOURCE_ID}',
        'popupIgnoreProperties': '_executionTime,_modifiedAt,_observedAt,_startedAt,beginTime,changeTime,createTime,_compositeId,_compositeOfIds,_createdAt,_status',
        'tooltipProperties': '',
        'linkEdgeTypes': '*',
        'linkColorPropertyNames': '',
        'affectedRadiusPropertyNames': '',
        'updateRate': 90000,
        'returnComposites': true,
        'initialViewLocation': '51.505,-0.09',
        'initialZoomLevel': 7,
        'locationTypesConfig': {}
    };
}


/**
 * Reads in configuration settings from the application YAML file.
 *
 * @return    {Object}   An object containing settings parsed from the config file
 * @private
 */
function parseConfigFile() {
    let configFile = path.join(__dirname + '/../../etc/config.yml');
    let storedSettings = {};

    try {
        if (fs.existsSync(configFile)) {
            console.info('INFO:    Reading YAML config file: %s', configFile);
            let ymlFile = fs.readFileSync(configFile, 'utf8');
            storedSettings = yaml.safeLoad(ymlFile);
        } else {
            console.info('INFO:    Reading application config from environment variables');
        }
    } catch (e) {
        console.error('WARNING: A problem occurred trying to parse the application config file: %s', e);
    }

    return storedSettings;
}


/**
 * Stores an individual config setting from a prioritised set of potential setting sources.
 * Highest priority is environment variables, then settings in the config file, and finally 
 * the hardcoded default values.
 *
 * @param   {string}   name             the name of the configuration setting
 * @param   {string}   envVarName       the name of the environment variable which may hold the setting
 * @param   {Object}   fileConfig       the configuration which has been read from file
 * @param   {boolean}  isInteger        a flag to indicate that the setting is an integer
 * @private
 */
function setConfigValue(name, envVarName, fileConfig, isInteger, isObject) {
    var source = null;

    if (process.env[envVarName] && process.env[envVarName] !== null &&
            (!isInteger || !isNaN(process.env[envVarName]))) {
        if (isObject) {
            try {
                settings[name] = JSON.parse(process.env[envVarName]);
            } catch (error) {
                console.error('Failed to parse env value: ', name)
            }
        } else if (isInteger) {
            settings[name] = parseInt(process.env[envVarName]);
        } else {
            settings[name] = process.env[envVarName];
        }
        source = 'environment variable';
    } else if (typeof fileConfig[name] !== 'undefined') {
        settings[name] = fileConfig[name];
        source = 'config file';
    } else {
        source = 'default';
    }
    console.info('CONFIG:  ' + name + '=' + settings[name] + ' (' + source + ')');
}


/**
 * Reads in configuration settings for the application. <br>
 *
 * This is done by parsing in the YAML config file, and merging the values in
 * with any environment variable overrides (which take precedent).
 *
 * @return    {Object}   An object containing up-to-date config settings
 */
function readConfig() {
    // Start by assigning defaults for all settings
    settings = getDefaults();

    // Parse the config file
    var fileConfig = parseConfigFile();

    // multiple props support 

    // Merge settings from the various sources
    setConfigValue('webServerPort', 'UI_SERVER_PORT', fileConfig, true);
    setConfigValue('webServerSecurePort', 'UI_SERVER_SECURE_PORT', fileConfig, true);
    setConfigValue('proxyServiceHost', 'PS_HOST', fileConfig, false);
    setConfigValue('proxyServicePort', 'PS_PORT', fileConfig, true);
    setConfigValue('proxyServiceTenantId', 'PS_TENANT', fileConfig, false);
    setConfigValue('proxyServiceUsername', 'PS_USERNAME', fileConfig, false);
    setConfigValue('proxyServicePassword', 'PS_PASSWORD', fileConfig, false);
    setConfigValue('proxyServiceRootPath', 'PS_ROOT_PATH', fileConfig, false);
    setConfigValue('asmUIURL', 'ASM_UI_URL', fileConfig, false);
    setConfigValue('popupIgnoreProperties', 'POPUP_IGNORE_PROPERTIES', fileConfig, false);
    setConfigValue('tooltipProperties', 'TOOLTIP_PROPERTIES', fileConfig, false);
    setConfigValue('updateRate', 'UPDATE_RATE', fileConfig, false);
    setConfigValue('linkEdgeTypes', 'LINK_TYPES', fileConfig, false);
    setConfigValue('linkColorPropertyNames', 'LINK_COLOR_PROPS', fileConfig, false);
    setConfigValue('affectedRadiusPropertyNames', 'AFFECTED_RADIUS_PROPS', fileConfig, false);
    setConfigValue('returnComposites', 'RETURN_COMPOSITES', fileConfig, false);
    setConfigValue('initialViewLocation', 'INIT_VIEW_LOCATION', fileConfig, false);
    setConfigValue('initialZoomLevel', 'INIT_ZOOM_LEVEL', fileConfig, false);
    setConfigValue('locationTypesConfig', 'LOCATION_TYPES_CONFIG', fileConfig, false, true);

    return settings;
}


/**
 * Provides access to the settings stored in this module. <br>
 *
 * @return    {Object}   An object containing up-to-date config settings
 */
function getSettings() {
    return settings;
}


// Define the public functionality of this module
exports.settings = getSettings;
exports.readConfig = readConfig;

