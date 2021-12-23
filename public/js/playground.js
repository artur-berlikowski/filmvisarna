import Movie from './Movie.js';

let movies;

init();

async function init() {
  let json = await $.getJSON('./../json/movies.json');
  movies = json.map((obj) => new Movie(obj));
  console.log(movies);
}