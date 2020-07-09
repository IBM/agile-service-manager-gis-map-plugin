// Import the module under test
import {createMarkerType} from '../../src/scripts/client/createMarkerType';

describe('createMarkerType', function() {
    test('create', function() {        
        expect(createMarkerType('myType')).toMatchSnapshot();
    });
});