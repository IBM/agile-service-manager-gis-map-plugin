// Import the module under test
import {createLinkType} from '../../src/scripts/client/createLinkType';

describe('createLinkType', function() {
    test('create', function() {        
        expect(createLinkType('myType')).toMatchSnapshot();
    });
});