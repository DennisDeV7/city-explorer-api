'use strict';

//Require
const express = require('express');
require('dotenv').config();
let data = require('./data/weather.json')
// console.log(data);

const cors = require('cors');
const axios = require('axios')

//Express
const app = express();

//USE
app.use(cors());

const PORT = process.env.PORT || 3002;

//Routes
app.get('/weather', async (request, response) => {
  try {
    const searchQuery = request.query.searchQuery;
    // console.log(searchQuery);
    let lat = request.query.lat;
    let lon = request.query.lon;
    console.log(lon);
    // let dataToGroom = data.find(weather => weather.city_name.toLowerCase() === searchQuery.toLowerCase());
    // console.log(dataToGroom);
    let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lang=en&units=I&days=5&lat=${lat}&lon=${lon}`;
    let dataToGroom = await axios.get(url);
    let dataToSend = dataToGroom.data.data.map(dayObj => new Forecast(dayObj));
    response.send(dataToSend);
    console.log(datatoSend);
  } catch (error) {
    console.log(error.message);
  }
})

app.get('/movies', async (request, response) => {
  try {
    const searchQuery = request.query.searchQuery;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}&page=1&include_adult=false`;
    let dataToGroom = await axios.get(url);
    let dataToSend = dataToGroom.data.results.map(movObj => new CityMovies(movObj));
    console.log(dataToSend);
    response.send(dataToSend);
  } catch (error) {
    // next(error);
  }
})

class CityMovies {
  constructor(movieObject) {
    this.title = movieObject.original_title;
    this.overview = movieObject.overview;
    this.average_votes = movieObject.vote_average;
    this.total_votes = movieObject.vote_count;
    this.image_url = movieObject.poster_path;
    this.popularity = movieObject.popularity;
    this.released_on = movieObject.release_date;
  }
}

class Forecast {
  constructor(weatherObject) {
    this.date = weatherObject.datetime;
    this.desc = weatherObject.weather.description;
  }
}

//Errors
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
})

//Listen
app.listen(PORT, () => console.log(`listening on port: ${PORT}`));
