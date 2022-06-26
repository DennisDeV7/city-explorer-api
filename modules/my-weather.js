'use strict';

const axios = require('axios');

async function getWeather(request, response, next){
  try {
    const searchQuery = request.query.searchQuery;
    // console.log(searchQuery);
    let lat = request.query.lat;
    let lon = request.query.lon;
    console.log(lon);
    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lang=en&units=I&days=5&lat=${lat}&lon=${lon}`;
    console.log(url);
    let dataToGroom = await axios.get(url);
    let dataToSend = dataToGroom.data.data.map(dayObj => new Forecast(dayObj));
    console.log(dataToSend);
    response.send(dataToSend);
  } catch (error) {
    // next(error);
  }
};

class Forecast {
  constructor(weatherObject) {
    this.date = weatherObject.datetime;
    this.desc = weatherObject.weather.description;
  }
}

module.exports = getWeather;