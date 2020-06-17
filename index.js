const express = require('express')
const path = require('path');
var consolidate = require('consolidate');
var templateRouter = require('./src/scripts/server/templateRouter');
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync(path.join(__dirname + '/src/etc/security/server.key'), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname + '/src/etc/security/server.crt'), 'utf8');
var credentials = {key: privateKey, cert: certificate};

// Read the application config before starting the HTTP server
var config = require('./src/scripts/server/config').readConfig();
const app = express()

app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/src/static');
app.use('/', templateRouter);

function logErrors(err, req, res, next) {
	console.error("mapper", err.stack )
	console.log("mapper", err)
	next(err)
}

app.use(logErrors)

// Initialise the Proxy Service facility
require('./src/scripts/server/psProxy').init(app);

app.use(express.static(path.join(__dirname, 'public/')))
app.use(express.static(path.join(__dirname, 'src/static/')))

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(config.webServerPort, () => console.log('Mapper app listening on port ' + config.webServerPort));
httpsServer.listen(config.webServerSecurePort, () => console.log('Mapper app listening on secure port ' + config.webServerSecurePort));