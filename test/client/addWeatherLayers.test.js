// Import the module under test
import addWeatherLayers from '../../src/scripts/client/addWeatherLayers';

describe('addWeatherLayers', function() {
    test('add overlay', function() {
        const overlay = {}
        addWeatherLayers(overlay, 'myKey')
        expect(overlay).toMatchSnapshot();
    });
});
