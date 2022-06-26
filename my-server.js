'use strict';

//Require
const express = require('express');
require('dotenv').config();
let data = require('./data/weather.json')
const cors = require('cors');
const axios = require('axios')


// Require modules
const getWeather = require('./modules/weather');
const getMovies = require('./modules/movie');

//Express
const app = express();

//USE
app.use(cors());

const PORT = process.env.PORT || 3002;

//Routes
app.get('/weather', getWeather); 
app.get('/movies', getMovies);

//Errors
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
})

//Listen
app.listen(PORT, () => console.log(`listening on port: ${PORT}`));
