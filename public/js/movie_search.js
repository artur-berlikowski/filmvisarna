//JSON data
let movies = [];
let shows = [];
let movieShows = [];
//Form data
let selectedMovie = 0;
let selectedDate = '';
let selectedAge = 'undefined';

initMovieDetailed();

async function initMovieDetailed() {
  await loadJSON();
  await createMovieShows();
  await generateMovieSelectOptions();
  await generateDatepicker();
  await generateAgeSelectOptions();
  await generateContent();
  await updateMovieInput();
  await updateDateInput();
  await updateAgeInput();
}

async function loadJSON() {
  movies = await $.getJSON('/json/movies.json');
  shows = await $.getJSON('/json/shows.json');
}

async function createMovieShows() {
  for (show of shows) {
    let movie = movies.find(movie => show.film === movie.title);
    let movieShow = {
      auditorium: show.auditorium,
      movie: show.film,
      date: show.date,
      time: show.time,
      runTime: movie.runTime,
      language: movie.language,
      genre: movie.genre,
      director: movie.director,
      actors: movie.actors,
      ageLimit: movie.ageLimit
    }
    movieShows.push(movieShow);
  }
}

async function generateMovieSelectOptions() {
  let $inputMovie = await $('#input_movie');
  $inputMovie.html('<option value="0">Välj Film</option>');
  for (movie of movies) {
    $inputMovie.append(`<option value="${movie.id}">${movie.title}</option>`);
  }
}

async function generateDatepicker() {
  $('#select_date .input-group.date').datepicker({
    format: "yyyy-mm-dd",
    maxViewMode: 2,
    language: 'sv',
    orientation: "auto left",
    calendarWeeks: true,
    autoclose: true,
    todayHighlight: true,
    weekStart: 1
  });
}

async function generateAgeSelectOptions() {
  let $inputAge = await $('#input_age');
  let ageLimits = [];
  for (movie of movies) {
    if (ageLimits.find(ageLimit => movie.ageLimit === ageLimit) === undefined) {
      ageLimits.push(movie.ageLimit);
    }
  }
  console.log(ageLimits.sort(function (a, b) {
    return a - b;
  }));
  $inputAge.html('<option value="undefined">Välj ålder</option>');
  for (ageLimit of ageLimits) $inputAge.append(`<option value="${ageLimit}">${ageLimit !== 0 ? ageLimit + ' år' : 'Barntillåten'}</option>`);
}

async function generateContent() {
  let data = movieShows;
  if (parseInt(selectedMovie) !== 0) data = data.filter(movieShow => movies.find(movie => selectedMovie === movie.id).title === movieShow.movie);
  console.log(selectedAge);
  if (selectedDate !== '') data = data.filter(movieShow => selectedDate === movieShow.date);
  if (selectedAge !== 'undefined') data = data.filter(movieShow => movieShow.ageLimit <= selectedAge);
  $head = await $('#movie_shows_data #head');
  $body = await $('#movie_shows_data #body');
  $head.html(`
    <tr>
      <th scope="col">Film Titel</th>
      <th scope="col">Datum</th>
      <th scope="col">Tid</th>
      <th scope="col">Salong</th>
      <th scope="col">Genre</th>
      <th scope="col">Språk</th>
      <th scope="col">Åldersgräns</th>
      <th scope="col">Längd</th>
      <th scope="col">Regissör</th>
    </tr>
  `);
  $body.html('');
  for (entry of data) {
    let ageLimit = entry.ageLimit === 0 ? 'Barntillåten' : entry.ageLimit + ' år';
    $html = `
      <tr>
        <td scope="row">${entry.movie}</td>
        <td>${entry.date}</td>
        <td>${entry.time}</td>
        <td>${entry.auditorium}</td>
        <td>${entry.genre}</td>
        <td>${entry.language}</td>
        <td>${ageLimit}</td>
        <td>${entry.runTime}</td>
        <td>${entry.director}</td>
      </tr>
    `;
    $body.append($html);
  }
}

async function updateMovieInput() {
  let $inputMovie = await $('#input_movie');
  $inputMovie.on('change', function () {
    selectedMovie = parseInt($inputMovie.val());
    console.log(selectedMovie);
    generateContent();
  });
}

async function updateDateInput() {
  let $calendar = await $('#select_date .input-group.date');
  let $input = await $('#input_date');
  $calendar.on('changeDate', function () {
    $input.val($calendar.datepicker('getFormattedDate'));
    selectedDate = $input.val();
    generateContent();
  });
}

async function updateAgeInput() {
  let $inputAge = await $('#input_age');
  $inputAge.on('change', function () {
    let value = $inputAge.val();
    selectedAge = value !== 'undefined' ? parseInt(value) : value;
    generateContent();
  });
}