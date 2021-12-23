
//JSON
let movies = [];
let auditoriums = [];
let shows = [];
let bookings = [];
//GENERAL
let generatedTrailers = [];

init();

async function init() {
  await loadJSON();
  await initMovies();
  await initForm();
}

async function initMovies() {
  let $movieContainer = await $('#movie_container');
  await generateMovies($movieContainer);
}

//Load required JSON files into variables
async function loadJSON() {
  movies = await $.getJSON('/json/movies.json');
  auditoriums = await $.getJSON('/json/auditorium.json');
  shows = await $.getJSON('/json/shows.json');
  bookings = await $.getJSON('/json/bookings.json');
}

async function generateMovies($mainContainer) {
  for (movie of movies) {
    let id = movie.id;
    let image = movie.image;
    let title = movie.title;
    let genre = movie.genre;
    let runTime = movie.runTime;
    let ageLimit = movie.ageLimit;
    let trailer = movie.trailerEmbed;
    let trailerId = 'trailer_' + id;
    let movieId = 'movie_' + id;

    let $movie = await generateMovie(id, image, title, genre, runTime, ageLimit);

    $mainContainer.append($movie);
    $trailerButton = generateTrailerModalButton(trailerId);
    $trailerModal = generateTrailerModal(trailerId, 'Trailer - ' + title, trailer);

    $('#' + movieId + ' #menu').append($trailerButton);
    $('main').append($trailerModal);
    generatedTrailers.push({
      id: trailerId,
      src: trailer
    });
  }
  await addTrailerListeners();
  await addBookingButtonListeners();
}

async function generateMovie(id, image, title, genre, runTime, ageLimit) {
  let $movie = $(`
  <div id="movie_${id}" class="container movie">
    <div class="row content">
      <div class="col-12 d-flex justify-content-start">
          <img id="image" src="${image}">
          <div id="info" class="d-block">
            <h4>${title}</h4>
            <p>${genre} | ${runTime} | ${ageLimit > 0 ? ageLimit + ' år' : 'Barntillåten'}</p>
          </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 d-flex justify-content-end">
        <div id="menu">
          <button id="${id}" type="button" class="btn btn-primary book-button">
            <img src="/image/book_seat_button.svg">
            <span>Boka nu</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  `);
  return $movie;
}

async function addTrailerListeners() {
  for (trailer of generatedTrailers) {
    let id = trailer.id;
    let src = trailer.src;
    let $id = '#' + id;
    let $modal = await $($id);

    $modal.on('show.bs.modal', function () {
      $($id + '_embed').attr('src', src + '?autoplay=1').show();
    });
    $modal.on('hide.bs.modal', function () {
      $($id + '_embed').attr('src', '');
    });
    $modal.on('hidden.bs.modal', function () {
      $($id + '_embed').attr('src', '');
    });
  }
}

async function addBookingButtonListeners() {
  $('.book-button').on('click', async function () {
    let $movieContainer = await $('#movie_container');
    let $this = await $(this);
    let $selectMovie = await $('#select_movie');
    let $inputMovie = await $('#input_movie');
    let id = parseInt($this.attr('id'));
    $inputMovie.val(id);
    $selectMovie.show();
    $inputMovie.change();
    $movieContainer.hide();
  });
}


