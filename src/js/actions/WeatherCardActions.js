var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var Persist = require('../utils/Persist');
var request = require('superagent');
var moment = require('moment');

// Map Open-Meteo WMO weather codes to custom icon numbers (00-25)
function mapWeatherCode(wmoCode) {
	var iconMap = {
		0: '04',    // Clear sky → sunny
		1: '01',    // Mainly clear → cloudy
		2: '01',    // Partly cloudy → cloudy
		3: '05',    // Overcast → overcast
		45: '14',   // Fog → fog
		48: '14',   // Depositing rime fog → fog
		51: '06',   // Light drizzle → light rain
		53: '06',   // Moderate drizzle → light rain
		55: '06',   // Dense drizzle → light rain
		56: '20',   // Light freezing drizzle → freezing rain
		57: '20',   // Dense freezing drizzle → freezing rain
		61: '06',   // Slight rain → light rain
		63: '08',   // Moderate rain → moderate rain
		65: '11',   // Heavy rain → heavy rain
		66: '20',   // Light freezing rain → freezing rain
		67: '20',   // Heavy freezing rain → freezing rain
		71: '07',   // Slight snow fall → light snow
		73: '09',   // Moderate snow fall → moderate snow
		75: '10',   // Heavy snow fall → heavy snow
		77: '10',   // Snow grains → heavy snow
		80: '02',   // Slight rain showers → shower
		81: '02',   // Moderate rain showers → shower
		82: '02',   // Violent rain showers → shower
		85: '03',   // Slight snow showers → snow shower
		86: '03',   // Heavy snow showers → snow shower
		95: '16',   // Thunderstorm → thundershower
		96: '21',   // Thunderstorm with slight hail → thundershowers with hail
		99: '21'    // Thunderstorm with heavy hail → thundershowers with hail
	};
	return iconMap[wmoCode] || '00'; // default to unknown weather
}

// Get weather description from WMO code
function getWeatherText(wmoCode) {
	var textMap = {
		0: 'Clear',
		1: 'Mainly Clear',
		2: 'Partly Cloudy',
		3: 'Overcast',
		45: 'Foggy',
		48: 'Foggy',
		51: 'Light Drizzle',
		53: 'Drizzle',
		55: 'Heavy Drizzle',
		56: 'Freezing Drizzle',
		57: 'Freezing Drizzle',
		61: 'Light Rain',
		63: 'Rain',
		65: 'Heavy Rain',
		66: 'Freezing Rain',
		67: 'Heavy Freezing Rain',
		71: 'Light Snow',
		73: 'Snow',
		75: 'Heavy Snow',
		77: 'Snow Grains',
		80: 'Light Showers',
		81: 'Showers',
		82: 'Heavy Showers',
		85: 'Snow Showers',
		86: 'Heavy Snow Showers',
		95: 'Thunderstorm',
		96: 'Thunderstorm with Hail',
		99: 'Thunderstorm with Hail'
	};
	return textMap[wmoCode] || 'Unknown';
}

function refresh() {
	getCoordinates(function (err, coords) {
		if (err) {
			dispatchError(err);
		} else {
			getForecast(coords, function (err, res) {
				if (err) {
					dispatchError(err);
				} else {
					var data = res.body;

					// Transform Open-Meteo response to match existing format
					var forecasts = [];
					var tempUnit = window.TupiqOptions.optsTempUnit === 'celcius' ? 'C' : 'F';

					for (var i = 0; i < Math.min(3, data.daily.time.length); i++) {
						var date = moment(data.daily.time[i]);
						var wmoCode = data.daily.weathercode[i];

						forecasts.push({
							item: {
								forecast: {
									day: date.format('ddd'),
									date: date.format('D MMM YYYY'),
									low: Math.round(data.daily.temperature_2m_min[i]).toString(),
									high: Math.round(data.daily.temperature_2m_max[i]).toString(),
									code: mapWeatherCode(wmoCode).toString(),
									text: getWeatherText(wmoCode)
								}
							},
							units: {
								temperature: tempUnit
							}
						});
					}

					var forecast = {
						location: {
							latitude: coords.latitude,
							longitude: coords.longitude
						},
						lastUpdated: moment().unix(),
						forecasts: forecasts
					};

					AppDispatcher.dispatch({
						actionType: AppConstants.WEATHER_REFRESH_SUCCESS,
						unitUsed: window.TupiqOptions.optsTempUnit,
						forecast: forecast
					});
				}
			});
		}
	});
}

function dispatchError(err) {
	AppDispatcher.dispatch({
		actionType: AppConstants.WEATHER_REFRESH_ERROR,
		error: err
	});
}

function getForecast(coords, callback) {
	var tempUnit, tempUnitParam;

	// If no unit has been set assume auto and base on user locale
	if (window.TupiqOptions.optsTempUnit.length === 0) {
		// Default to Fahrenheit for US, Celsius for rest of world
		tempUnit = navigator.language === 'en-US' ? 'fahrenheit' : 'celsius';
	} else {
		tempUnit = window.TupiqOptions.optsTempUnit === 'celcius' ? 'celsius' : 'fahrenheit';
	}

	request
		.get('https://api.open-meteo.com/v1/forecast')
		.query({
			latitude: coords.latitude,
			longitude: coords.longitude,
			daily: 'temperature_2m_max,temperature_2m_min,weathercode',
			temperature_unit: tempUnit,
			timezone: 'auto',
			forecast_days: 3
		})
		.end(callback);
}

function getCoordinates(callback) {
	navigator.geolocation.getCurrentPosition(function (position) {
		callback(null, position.coords);
	}, function (err) {
		callback(err);
	});
}

var WeatherCardActions = {
	refresh: function (unitChange) {
		unitChange = unitChange || false;

		refresh();

		AppDispatcher.dispatch({
			actionType: AppConstants.WEATHER_REFRESH,
			unitChange: unitChange
		});
	}
};

module.exports = WeatherCardActions;
