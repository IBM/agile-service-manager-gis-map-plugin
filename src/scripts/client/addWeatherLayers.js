import L from 'leaflet';
export default function addWeatherLayers(overlays, apiKey) {
    const getWeatherAttribution = function() {
        return 'Weather from <a href="http://openweathermap.org/" alt="World Map and worldwide Weather Forecast online">OpenWeatherMap</a>';
    };

    const weatherLayers = [
        {
            id: 'clouds_new',
            name: 'Clouds'
        },
        {
            id: 'precipitation_new',
            name: 'Precipitation'
        },
        {
            id: 'pressure_new',
            name: 'Sea level pressure'
        },
        {
            id: 'wind_new',
            name: 'Wind speed'
        },
        {
            id: 'temp_new',
            name: 'Temperature'
        }
    ];

    // Create weather layer definitions
    weatherLayers.forEach(weatherLayer => {
        weatherLayer.layer = L.tileLayer('https://tile.openweathermap.org/map/' + weatherLayer.id + '/{z}/{x}/{y}.png?appid=' + apiKey, {
            attribution: getWeatherAttribution(),
            maxZoom: 19,
            maxClusterRadius: 120
        });
        overlays[weatherLayer.name] = weatherLayer.layer;
    });
}