// Import the module under test
import getProvidedValue from '../../../src/scripts/client/utils/getProvidedValue';

describe('getProvidedValue', function() {
    test('no valid params', function() {
        const value = getProvidedValue()
        expect(value).toEqual(null);
    });
    test('single value', function() {
        const data = {
            test: 1,
            test2: 2,
            test3: 'hello'
        }
        const value = getProvidedValue(['test2'], data)
        expect(value).toEqual(2);
    });
    test('two valid values present', function() {
        const data = {
            test: 1,
            test2: 2,
            test3: 'hello'
        }
        const value = getProvidedValue(['test', 'test2'], data)
        expect(value).toEqual(1);
    });

    test('two values present, one undefined', function() {
        const data = {
            test: 1,
            test2: 2,
            test3: 'hello'
        }
        const value = getProvidedValue(['invalid', 'test2'], data)
        expect(value).toEqual(2);
    });

    test('two values present, one invalid', function() {
        const data = {
            test: 1,
            test2: 2,
            test3: 'hello',
            invalid: ''
        }
        const value = getProvidedValue(['invalid', 'test2'], data)
        expect(value).toEqual(2);
    });
});
