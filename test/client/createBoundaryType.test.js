// Import the module under test
import {createBoundaryType} from '../../src/scripts/client/createBoundaryType';

describe('createBoundaryType', function() {
    test('create', function() {        
        expect(createBoundaryType('myType')).toMatchSnapshot();
    });
});
