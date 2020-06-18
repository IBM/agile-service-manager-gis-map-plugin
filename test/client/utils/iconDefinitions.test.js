// Import the module under test
import {severityToIcon, getMarkerByState} from '../../../src/scripts/client/utils/iconDefinitions';

describe('iconDefinitions', function() {
    test('severityToIcon correct', function() {
        expect(severityToIcon).toMatchSnapshot();
    });

    test('getMarkerByState default', function() {
        const marker = getMarkerByState('');

        expect(marker).toMatchSnapshot();
    });

    test('getMarkerByState warning', function() {
        const marker = getMarkerByState('warning');

        expect(marker).toMatchSnapshot();
    });
});