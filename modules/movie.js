'use strict';

const axios = require('axios');

async function getMovies(request, response, next){
  try {
    const searchQuery = request.query.searchQuery;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}&page=1&include_adult=false`;
    let dataToGroom = await axios.get(url);
    let dataToSend = dataToGroom.data.results.map(movObj => new CityMovies(movObj));
    // console.log(dataToSend);
    response.send(dataToSend);
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