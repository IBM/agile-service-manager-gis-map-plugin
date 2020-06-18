// Import the module under test
import parseLocationSearch from '../../../src/scripts/client/utils/parseLocationSearch';

describe('parseLocationSearch', function() {
    test('no valid params', function() {
        const value = parseLocationSearch()
        expect(value).toEqual({});
    });
    test('extract url search params', function() {
        const value = parseLocationSearch('?prop1=value1&prop2=value2')
        expect(value).toEqual({
            prop1: 'value1',
            prop2: 'value2'
        });
    });
});