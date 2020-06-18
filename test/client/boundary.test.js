// Import the module under test
import * as boundary from '../../src/scripts/client/boundary';
import L from 'leaflet';

describe('boundary', function() {
    test('addBoundary, no boundaries', function() {
        const addLayer = jest.fn();
        const view = {
            boundaryTypes: {
                myType: {
                    clusterGroup: {
                        addLayer: addLayer
                    }
                },
            },
            configParams: {
                tooltipProperties: []
            }
        };
        const location = {
            _id: 'id123',
            name: 'myLocation',
            entityTypes: ['myType']
        };
        boundary.addBoundary(view, 'myType', location);
        expect(addLayer).toHaveBeenCalled();
        expect(view).toMatchSnapshot();
    });

    test('addBoundary, tooltips', function() {
        const addLayer = jest.fn();
        const view = {
            boundaryTypes: {
                myType: {
                    clusterGroup: {
                        addLayer: addLayer
                    }
                },
            },
            configParams: {
                tooltipProperties: ['tooltipProp', 'tryToShowThis']
            }
        };
        const location = {
            _id: 'id123',
            name: 'myLocation',
            entityTypes: ['myType'],
            tooltipProp: 'showThis'
        };
        boundary.addBoundary(view, 'myType', location);
        expect(addLayer).toHaveBeenCalled();
        expect(view).toMatchSnapshot();
    });

    test('addBoundary, status', function() {
        const addLayer = jest.fn();
        const view = {
            boundaryTypes: {
                myType: {
                    clusterGroup: {
                        addLayer: addLayer
                    }
                },
            },
            configParams: {
                tooltipProperties: []
            }
        };
        const location = {
            _id: 'id123',
            name: 'myLocation',
            entityTypes: ['myType'],
            _hasStatus: 'major'
        };
        boundary.addBoundary(view, 'myType', location);
        expect(addLayer).toHaveBeenCalled();
        expect(view).toMatchSnapshot();
    });

    test('updateBoundary, previous boundary', function() {
        const addLayer = jest.fn();
        const view = {
            boundaryTypes: {
                myType: {
                    clusterGroup: {
                        addLayer: addLayer
                    },
                    boundaries: {
                        id123: L.polygon([])
                    }
                },
            },
            configParams: {
                tooltipProperties: []
            }
        };
        const location = {
            _id: 'id123',
            name: 'myLocation',
            entityTypes: ['myType']
        };
        boundary.updateBoundary(view, 'myType', location);
        expect(view).toMatchSnapshot();
    });

    test('updateBoundary, no boundaries', function() {
        const addLayer = jest.fn();
        const view = {
            boundaryTypes: {
                myType: {
                    clusterGroup: {
                        addLayer: addLayer
                    }
                },
            },
            configParams: {
                tooltipProperties: []
            }
        };
        const location = {
            _id: 'id123',
            name: 'myLocation',
            entityTypes: ['myType']
        };
        boundary.updateBoundary(view, 'myType', location);
        expect(view).toMatchSnapshot();
    });
});