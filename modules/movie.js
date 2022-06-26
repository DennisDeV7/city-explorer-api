'use strict';

const axios = require('axios');

let cache = require('./cache.js');

async function getMovies(request, response, next){
  try {
    const searchQuery = request.query.searchQuery;

    // Create a key so we can give a label for the thing we are putting in the cache
    let key = searchQuery + 'Data';

    let acceptableTimeToCache = 1000 * 60 * 60 * 24 * 30;
    // Is it in the Cache?
    if(cache[key] && Date.now() - cache[key].timestamp < acceptableTimeToCache){
      // If in cache, give data
      console.log('Movies cache miss');
      response.status(200).send(cache[key].data);
    } else { 
      // If it is not in cache, make a new request to API
      console.log('Movies cache hit')  
      let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}&page=1&include_adult=false`;
      let dataToGroom = await axios.get(url);
      let dataToSend = dataToGroom.data.results.map(movObj => new CityMovies(movObj));
      
      // add this data to the cache
      cache[key] = {
        data: dataToSend,
        timestamp: Date.now()
      }

      response.send(dataToSend);
    }
  } catch (error) {
    next(error);
  }
}

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

module.exports = getMovies;