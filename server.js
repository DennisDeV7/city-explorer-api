'use strict';

console.log('our first server');


//Require
const express = require('express');
require('dotenv').config();
let data = require('./data/weather.json')
// console.log(data);

const cors = require('cors');
//USE

//Express
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

//Routes
app.get('/weather', (request, response) => {
  try {
    const searchQuery = request.query.searchQuery;
    console.log(searchQuery);
    let dataToGroom = data.find(weather => weather.city_name.toLowerCase() === searchQuery.toLowerCase());
    console.log(dataToGroom);
    let dataToSend = dataToGroom.data.map(dayObj => new Forecast(dayObj));
    response.send(dataToSend);
    console.log(datatoSend);
  } catch (error) {
    // next(error);
  }
})

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
