'use strict';

console.log('our first server');


//Require
const express = require('express');
require('dotenv').config();
let data = require('./data/weather.json')
console.log(data);

const cors = require('cors');
//USE

//Express
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

//Routes
app.get('/weather', (request, response) => {
  try {
    let latFromRequest = request.query.lat;
    let lonFromRequest = request.query.lon;
    let searchQueryRequest = request.query.searchQuery;
    let dataToGroom = data.find(weather => weather.lat === latFromRequest && weather.lat === lonFromRequest && weather.searchQuery === searchQueryRequest);
    let dataToSend = new Forecast(dataToGroom);
    response.send(dataToSend);
  } catch (error) {
    next(error);
  }
})

class Forecast {
  constructor(weatherObject) {
    this.date = weatherObject.date;
    this.desc = weatherObject.desc;
  }
}

//Errors

//Listen
app.listen(PORT, () => console.log(`listening on port: ${PORT}`));
