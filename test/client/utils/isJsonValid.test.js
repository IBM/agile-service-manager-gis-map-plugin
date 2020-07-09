import isJsonValid from '../../../src/scripts/client/utils/isJsonValid';

describe('isJsonValid :', function() {
    it('Invalid JSON, key not in quotes', function() {
        const input = '[{bob: 1}]';
        expect(isJsonValid(input)).not.toBeTruthy();
    });

    it('Invalid JSON, missing }', function() {
        const input = '[{bob: 1]';
        expect(isJsonValid(input)).not.toBeTruthy();
    });

    it('Invalid JSON, missing ]', function() {
        const input = '[{bob: 1}';
        expect(isJsonValid(input)).not.toBeTruthy();
    });

    it('Valid JSON', function() {
        const input = '[{"bob": 1}]';
        expect(isJsonValid(input)).toBeTruthy();
    });
});
