loadMovies();

async function loadMovies() {
  let movies = await (await fetch('/json/movies.json')).json();
  generateMovieInfo(movies);
  displayMovies(movies);
}

async function generateMovieInfo(movies) {
  let $mainContainer = $('main');
  let generatedInfoBoxes = [];
  let generatedTrailerModals = [];
  for (movie of movies) {
    let id = 'movieInfoBox_' + movie.id;
    let title = movie.title;
    let genre = movie.genre;
    let runTime = movie.runTime;
    let plot = movie.plot;
    let premier = movie.premier;
    let director = movie.director;
    let actors = movie.actors;
    let ageLimit = movie.ageLimit;
    let language = movie.language;
    let image = movie.image;
    let rating = movie.movieRating;
    let imbdLink = movie.imbdLink;
    let trailer = movie.trailerEmbed;
    let trailerModalId = id + '_trailer';
    let $movieInfoBox = generateMovieInfoBox(id, title, genre, runTime, plot, premier, director, actors, ageLimit, language, image, rating, imbdLink);
    let $trailer = generateTrailerModal(trailerModalId, 'Trailer - ' + title, trailer);

    generatedTrailerModals.push({
      id: trailerModalId,
      src: trailer
    });
    $mainContainer.prepend(await $movieInfoBox);
    $mainContainer.append($trailer);
    generatedInfoBoxes.push(id);
  }
  addMovieInfoBoxListeners(generatedInfoBoxes, generatedTrailerModals);
  for (generatedInfoBox of generatedInfoBoxes) {
    await $('#' + generatedInfoBox).hide();
  }
}

async function displayMovies(movies) {
  let generatedMovieButtons = [];
  for (let movie of movies) {
    let movieButtonId = 'MovieButton_' + movie.id;
    $('#movie_row').append(`
        <div class="col-sm col-md col-lg mx-auto">
          <div class="card" style="width: 17rem;">
            <img
              src="${movie.image}"
              class="card-img-top movieimg" alt="A picture on the Dune movie">
            <div class="card-body movie-card-body">
              <h5 class="card-title">${movie.title}</h5>
            </div>
            <div class="movie-button-container">
            <p class="card-text">${movie.runTime}
              </p>
            <a id="${movieButtonId}" class="btn btn-primary" href="#top">Mer Info</a>
            </div>
          </div>
        </div>
    `)
    generatedMovieButtons.push(movieButtonId);
  }
  addMovieButtonListeners(generatedMovieButtons);
}

async function generateMovieInfoBox(id, title, genre, runTime, plot, premier, director, actors, ageLimit, language, image, rating, imbdLink) {
  let $movieInfoBox = $(`
    <div id="${id}" class="container">
      <div class="card border-0 my-5 movie-info">
        <div class="card-body p-5">
          <div class="row">
              <div class="row justify-content-evenly">
              <div class="row movie-title"><div class="col"><p>${title}</p></div></div>
                <div class="col-md-4 col-xl-3 ">
                <img src=" ${image}" class="rounded mx-auto d-block image" alt="...">
                <h5 id="rating" align="center">⭐${rating}</h5>
                </div>
                <div class="col-md-6 col-xl-7">
                    <hr class="line">
                    <p class="value">${plot}</p>
                    <p class="value"><u class="category">Premier:</u> ${premier}</p>
                    <p class="value"><u class="category">Genre:</u> ${genre}</p>
                    <p class="value"><u class="category">Längd:</u> ${runTime}</p>
                    <p class="value"><u class="category">Regi:</u> ${director}</p>
                    <p class="value"><u class="category">Skådespelare:</u> ${actors}</p>
                    <p class="value"><u class="category">Åldersgräns:</u> ${ageLimit}</p>
                    <p class="value"><u class="category">Språk:</u> ${language}</p>
                    <p class="value"><a href="${imbdLink}" target="_blank"> Mer information om filmen</a></p>
                    <hr class="line">
                    <div class="menu">
                      <button id="button_book"><img src="/image/book_seat_button.svg"><span>Boka Film<span></button>
                      <button data-bs-toggle="modal" data-bs-target="#${id}_trailer"><img src="/image/trailer_play_button.svg"><span>Se Trailer</span></button>
                      <button id="button_close"><img src="/image/close_button.svg"><span>Stäng<span></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
  return $movieInfoBox;
}

async function addMovieButtonListeners(generatedMovieButtons) {
  for (button of generatedMovieButtons) {
    let movieNumber = button.substring(button.length - 1);
    let $button = await $('#' + button);
    $button.click(function () {
      $('[id^="movieInfoBox"]').hide();
      $('#movieInfoBox_' + movieNumber).show();
    });
  };
}

async function addMovieInfoBoxListeners(generatedInfoBoxes, generatedTrailerModals) {
  for (generatedInfoBox of generatedInfoBoxes) {
    let $infoBox = await $('#' + generatedInfoBox);
    let $bookButton = await $infoBox.find('#button_book');
    let $closeButton = await $infoBox.find('#button_close');

    $bookButton.on('click', function () {
      window.location.replace("/booking");
    });
    $closeButton.on('click', function () {
      $infoBox.hide();
    });
  }
  for (modal of generatedTrailerModals) {
    let id = modal.id;
    let src = modal.src;
    let $id = '#' + id;
    let $modal = await $($id);
    console.log($modal);
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

