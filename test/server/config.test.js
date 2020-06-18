// Import the module under test
import * as config from '../../src/scripts/server/config';

const fs = require('fs');
jest.mock('fs');


describe('config', function() {
    test('readConfig: use defaults if YAML file does not exist', function() {
        // Mock the fs.readFileSync function so it throws an error
        fs.existsSync.mockImplementation(() => false);

        config.readConfig();
        let testSettings = config.settings();

        expect(testSettings).toMatchSnapshot();
    });

    test('readConfig: read config from YAML file', function() {
        // Mock the fs.readFileSync function so it does not actually try to read from a file
        // but instead returns a hardcoded string
        const yaml =
            'webServerPort: 1000' + '\n' +
            'proxyServiceHost: localhost' + '\n' +
            'proxyServicePort: 2000' + '\n' +
            'proxyServiceUsername: asm' + '\n' +
            'proxyServiceRootPath: /1.0/';
        fs.readFileSync.mockImplementation(() => yaml);
        fs.existsSync.mockImplementation(() => true);

        config.readConfig();
        let testSettings = config.settings();

        let expected = 1000;
        let actual = testSettings.webServerPort;
        expect(actual).toBe(expected);

        expect(testSettings).toMatchSnapshot();
    });

    test('readConfig: read config from environment variables', function() {
        process.env.UI_SERVER_PORT = 4000;
        process.env.PS_HOST = 'host.com';

        config.readConfig();
        let testSettings = config.settings();

        let expected = 4000;
        let actual = testSettings.webServerPort;
        expect(actual).toBe(expected);

        expected = 'host.com';
        actual = testSettings.proxyServiceHost;
        expect(actual).toBe(expected);


        // Clean up
        delete process.env.UI_SERVER_PORT;
        delete process.env.PS_HOST;
    });

    
});
