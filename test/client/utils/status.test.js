// Import the module under test
import * as status from '../../../src/scripts/client/utils/status';

describe('Status', function() {
    test('severityRank defaults', function() {
        expect(status.severityRank).toMatchSnapshot();
    });
    test('severityColors defaults', function() {
        expect(status.severityColors).toMatchSnapshot();
    });

    test('propertySortHighToLow lower value with rank map', function() {
        const sort = status.propertySortHighToLow('test', status.severityRank)
        expect(sort({test: 'clear'}, {test: 'major'})).toEqual(1);
    });

    test('propertySortHighToLow same value with rank map', function() {
        const sort = status.propertySortHighToLow('test', status.severityRank)
        expect(sort({test: 'clear'}, {test: 'clear'})).toEqual(0);
    });

    test('propertySortHighToLow higher value with rank map', function() {
        const sort = status.propertySortHighToLow('test', status.severityRank)
        expect(sort({test: 'warning'}, {test: 'clear'})).toEqual(-1);
    });

    test('propertySortHighToLow lower value without rank map', function() {
        const sort = status.propertySortHighToLow('test')
        expect(sort({test: 'a'}, {test: 'f'})).toEqual(1);
    });

    test('propertySortHighToLow same value without rank map', function() {
        const sort = status.propertySortHighToLow('test')
        expect(sort({test: 'b'}, {test: 'b'})).toEqual(0);
    });

    test('propertySortHighToLow higher value without rank map', function() {
        const sort = status.propertySortHighToLow('test')
        expect(sort({test: 'z'}, {test: 'b'})).toEqual(-1);
    });


    test('propertySortLowToHigh lower value with rank map', function() {
        const sort = status.propertySortLowToHigh('test', status.severityRank)
        expect(sort({test: 'clear'}, {test: 'major'})).toEqual(-1);
    });

    test('propertySortLowToHigh same value with rank map', function() {
        const sort = status.propertySortLowToHigh('test', status.severityRank)
        expect(sort({test: 'clear'}, {test: 'clear'})).toEqual(0);
    });

    test('propertySortLowToHigh higher value with rank map', function() {
        const sort = status.propertySortLowToHigh('test', status.severityRank)
        expect(sort({test: 'warning'}, {test: 'clear'})).toEqual(1);
    });

    test('propertySortLowToHigh lower value without rank map', function() {
        const sort = status.propertySortLowToHigh('test')
        expect(sort({test: 'a'}, {test: 'f'})).toEqual(-1);
    });

    test('propertySortLowToHigh same value without rank map', function() {
        const sort = status.propertySortLowToHigh('test')
        expect(sort({test: 'b'}, {test: 'b'})).toEqual(0);
    });

    test('propertySortLowToHigh higher value without rank map', function() {
        const sort = status.propertySortLowToHigh('test')
        expect(sort({test: 'z'}, {test: 'b'})).toEqual(1);
    });

    
});