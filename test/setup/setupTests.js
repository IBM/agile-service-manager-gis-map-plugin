// Supress console logging during execution of tests, so CLI output is
// not cluttered with irrelevant output
jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());



// Helper function for sending debug log output to a text file.
// This can help debug failing unit tests, where console.log is insufficent due to
// jest overwriting the console output with its own.
// To use it, just call process.debug('My message') in any test module.
// Note that it won't work if the fs module has been mocked.
process.debug = function(msg) {
    const DEBUG_LOG = './node-debug.log';
    const fs = require('fs');
    fs.appendFileSync(DEBUG_LOG, msg + '\n');
};

