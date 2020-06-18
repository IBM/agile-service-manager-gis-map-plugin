// Import the module under test
import * as config from '../../src/scripts/server/config';

const fs = require('fs');
jest.mock('fs');


describe('config', function() {
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
});
