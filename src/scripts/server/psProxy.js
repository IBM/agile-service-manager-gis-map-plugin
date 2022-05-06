process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
/**
 * This module helps to configure express middleware in order to intercept
 * requests to the ASM backend and forward them on to the ASM proxy service. <br>
 *
 * This work is done in a module of its own simply to help organise the
 * code and reduce the amount of logic in the main server.js module.
 *
 * @module psProxy
 */

var proxy = require('express-http-proxy');
var url = require('url');
var config = require('./config').settings();

var proxyReqPathResolverFactory = function(remotePath) {
    return function(req) {
        var apiPath = url.parse(req.url).path;
        return remotePath + apiPath;
    };
};

var proxyReqOptDecoratorFactory = function(tenantId, username, password) {
    let encodedHeader = null;
    if (username && username !== '' && password && password !== '') {
        var plainHeader = username + ':' + password;
        encodedHeader = new Buffer.from(plainHeader, 'utf-8').toString('base64');
    }

    return function(proxyReq) {
        if (tenantId && tenantId !== '') {
            proxyReq.headers['X-TenantID'] = tenantId;
        }
        if (proxyReq.method === 'POST') {
            proxyReq.headers['Content-Type'] = 'application/json; charset=utf-8';
            proxyReq.headers.Accept = 'application/json; charset=utf-8';
        }
        if (encodedHeader) {
            proxyReq.headers.Authorization = 'Basic ' + encodedHeader;
        }
        return proxyReq;
    };
};

/**
 * Configures the express app routing to use the proxy module in order
 * to intercept requests to the proxy service.
 *
 * @param   {Object}   app   the express app object
 */
function init(app) {
    // Define the host and path mappings for the REST API proxy
    var remoteHost = 'https://' + config.proxyServiceHost + ':' + config.proxyServicePort;
    var remotePath = config.proxyServiceRootPath;
    if (remotePath.endsWith('/')) {
        remotePath = remotePath.substring(0, remotePath.length - 1);
    }
    console.info("INIT " + remoteHost, remotePath);

    // Define the /proxy_service routing behaviour
    app.use('/proxy_service', proxy(remoteHost, {
        proxyReqPathResolver: proxyReqPathResolverFactory(remotePath),
        proxyReqOptDecorator: proxyReqOptDecoratorFactory(config.proxyServiceTenantId,
                                                          config.proxyServiceUsername,
                                                          config.proxyServicePassword)
    }));

    // Define an exception handler for the REST API proxy
    app.use('/proxy_service', function(err, req, res) {
        console.log('ERROR:   ' + JSON.stringify(err, null, 2));
        res.status(500);
        res.json({
            '_error': {
                'messageId': err.errno,
                'level': 'error',
                'message': 'The data request failed',
                'description': JSON.stringify(err, null, 2)
            }
        });
    });
}

// Define the public functionality of this module
exports.init = init;

