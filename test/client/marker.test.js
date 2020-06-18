// Import the module under test
import * as marker from '../../src/scripts/client/marker';
import L from 'leaflet';

describe('marker', function() {
    test('addMarker, no markers', function() {
        const addLayer = jest.fn();
        const view = {
            markerTypes: {
                myType: {
                    clusterGroup: {
                        addLayer: addLayer
                    },
                    affectedRadiusMarkers: []
                },
            },
            configParams: {
                longProps: ['long'],
                latProps: ['lat'],
                tooltipProperties: []
            }
        };
        const location = {
            _id: 'id123',
            name: 'myLocation',
            entityTypes: ['myType'],
            long: 1,
            lat: 2
        };
        marker.addMarker(view, 'myType', location);
        expect(addLayer).toHaveBeenCalled();
        expect(view).toMatchSnapshot();
    });

    test('addMarker, no markers + hideAffectedRadius', function() {
        const addLayer = jest.fn();
        const view = {
            markerTypes: {
                myType: {
                    clusterGroup: {
                        addLayer: addLayer
                    },
                    affectedRadiusMarkers: []
                },
            },
            configParams: {
                longProps: ['long'],
                latProps: ['lat'],
                tooltipProperties: [],
                hideAffectedRadius: true
            }
        };
        const location = {
            _id: 'id123',
            name: 'myLocation',
            entityTypes: ['myType'],
            long: 1,
            lat: 2
        };
        marker.addMarker(view, 'myType', location);
        expect(addLayer).toHaveBeenCalled();
        expect(view).toMatchSnapshot();
    });

    test('addMarker, no type cluster group', function() {
        const addLayer = jest.fn();
        const view = {
            markerTypes: {
                myType: {
                    affectedRadiusMarkers: []
                },
            },
            clusterGroup: {
                addLayer: addLayer
            },
            configParams: {
                longProps: ['long'],
                latProps: ['lat'],
                tooltipProperties: []
            }
        };
        const location = {
            _id: 'id123',
            name: 'myLocation',
            entityTypes: ['myType'],
            long: 1,
            lat: 2
        };
        marker.addMarker(view, 'myType', location);
        expect(addLayer).toHaveBeenCalled();
        expect(view).toMatchSnapshot();
    });


    test('addMarker, has status', function() {
        const addLayer = jest.fn();
        const view = {
            markerTypes: {
                myType: {
                    clusterGroup: {
                        addLayer: addLayer
                    },
                    affectedRadiusMarkers: []
                },
            },
            configParams: {
                longProps: ['long'],
                latProps: ['lat'],
                tooltipProperties: []
            }
        };
        const location = {
            _id: 'id123',
            name: 'myLocation',
            entityTypes: ['myType'],
            long: 1,
            lat: 2,
            _hasStatus: 'warning'
        };
        marker.addMarker(view, 'myType', location);
        expect(addLayer).toHaveBeenCalled();
        expect(view).toMatchSnapshot();
    });

    test('addMarker, has tooltip props', function() {
        const addLayer = jest.fn();
        const view = {
            markerTypes: {
                myType: {
                    clusterGroup: {
                        addLayer: addLayer
                    },
                    affectedRadiusMarkers: []
                },
            },
            configParams: {
                longProps: ['long'],
                latProps: ['lat'],
                tooltipProperties: ['tooltipProp', 'tryToShowThis']
            }
        };
        const location = {
            _id: 'id123',
            name: 'myLocation',
            entityTypes: ['myType'],
            long: 1,
            lat: 2,
            tooltipProp: 'showThis'
        };
        marker.addMarker(view, 'myType', location);
        expect(addLayer).toHaveBeenCalled();
        expect(view).toMatchSnapshot();
    });

    test('addMarker, no affectedRadiusMarkers, with radius', function() {
        const addLayer = jest.fn();
        const addAffectedLayer = jest.fn();
        const view = {
            markerTypes: {
                myType: {
                    clusterGroup: {
                        addLayer: addLayer
                    },
                    affectedRadiusMarkers: {},
                    affectedRadiusMarkersLayer: {
                        addLayer: addAffectedLayer
                    }
                },
            },
            configParams: {
                longProps: ['long'],
                latProps: ['lat'],
                tooltipProperties: [],
                affectedRadiusProps: ['radius']
            }
        };
        const location = {
            _id: 'id123',
            name: 'myLocation',
            entityTypes: ['myType'],
            long: 1,
            lat: 2,
            radius: 5
        };
        marker.addMarker(view, 'myType', location);
        expect(addLayer).toHaveBeenCalled();
        expect(view).toMatchSnapshot();
    });

    test('addMarker, known affectedRadiusMarkers, with radius', function() {
        const addLayer = jest.fn();
        const view = {
            markerTypes: {
                myType: {
                    clusterGroup: {
                        addLayer: addLayer
                    },
                    affectedRadiusMarkers: {
                        id123: L.circle([])
                    }
                },
            },
            configParams: {
                longProps: ['long'],
                latProps: ['lat'],
                tooltipProperties: [],
                affectedRadiusProps: ['radius']
            }
        };
        const location = {
            _id: 'id123',
            name: 'myLocation',
            entityTypes: ['myType'],
            long: 1,
            lat: 2,
            radius: 5
        };
        marker.addMarker(view, 'myType', location);
        expect(addLayer).toHaveBeenCalled();
        expect(view).toMatchSnapshot();
    });

    test('addMarker, known affectedRadiusMarkers, with no radius', function() {
        const addLayer = jest.fn();
        const removeLayer = jest.fn();
        const view = {
            markerTypes: {
                myType: {
                    clusterGroup: {
                        addLayer: addLayer
                    },
                    affectedRadiusMarkers: {
                        id123: L.circle([])
                    },
                    affectedRadiusMarkersLayer: {
                        removeLayer: removeLayer
                    }
                },
            },
            configParams: {
                longProps: ['long'],
                latProps: ['lat'],
                tooltipProperties: [],
                affectedRadiusProps: ['radius']
            }
        };
        const location = {
            _id: 'id123',
            name: 'myLocation',
            entityTypes: ['myType'],
            long: 1,
            lat: 2
        };
        marker.addMarker(view, 'myType', location);
        expect(addLayer).toHaveBeenCalled();
        expect(removeLayer).toHaveBeenCalled();
        expect(view).toMatchSnapshot();
    });

    test('updateMarker, no markers', function() {
        const addLayer = jest.fn();
        const view = {
            markerTypes: {
                myType: {
                    clusterGroup: {
                        addLayer: addLayer
                    },
                    affectedRadiusMarkers: []
                },
            },
            configParams: {
                longProps: ['long'],
                latProps: ['lat'],
                tooltipProperties: []
            }
        };
        const location = {
            _id: 'id123',
            name: 'myLocation',
            entityTypes: ['myType'],
            long: 1,
            lat: 2
        };
        marker.updateMarker(view, 'myType', location);
        expect(addLayer).not.toHaveBeenCalled();
        expect(view).toMatchSnapshot();
    });

    test('updateMarker, known markers', function() {
        const addLayer = jest.fn();
        const view = {
            markerTypes: {
                myType: {
                    clusterGroup: {
                        addLayer: addLayer
                    },
                    affectedRadiusMarkers: [],
                    markers: {
                        id123: L.marker([])
                    }
                },
            },
            configParams: {
                longProps: ['long'],
                latProps: ['lat'],
                tooltipProperties: []
            }
        };
        const location = {
            _id: 'id123',
            name: 'myLocation',
            entityTypes: ['myType'],
            long: 1,
            lat: 2
        };
        marker.updateMarker(view, 'myType', location);
        expect(addLayer).not.toHaveBeenCalled();
        expect(view).toMatchSnapshot();
    });
});