'use strict';

let cache = require('./cache.js');
const axios = require('axios');


function getWeather(lat, lon) {
  const key = 'weather-' + lat + lon;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${lat}&lon=${lon}&days=5`;
  
  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Weather Cache hit');
  } else {
    console.log('Weather Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url)
    .then(response => parseWeather(response.data));
  }
  
  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Weather(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(day) {
    this.desc = day.weather.description;
    this.date = day.datetime;
  }
}

module.exports = getWeather;