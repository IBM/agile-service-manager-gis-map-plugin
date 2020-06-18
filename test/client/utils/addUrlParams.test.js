// Import the module under test
import addUrlParams from '../../../src/scripts/client/utils/addUrlParams';

describe('addUrlParams', function() {
    test('no valid params', function() {
        const newUrl = addUrlParams('')
        expect(newUrl).toEqual('');
    });

    test('Single value', function() {
        const newUrl = addUrlParams('test.com?', ['foo'], 'bar')
        expect(newUrl).toEqual('test.com?&bar=foo');
    });
});
