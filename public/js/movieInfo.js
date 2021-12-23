//function takes info from json file and puts it into html code.
//the info taken depends on which movie is selected.
async function updateMovieInfo() {
  let movies = await $.getJSON('/json/movies.json');
  let movie = movies[3];
  let modalId = 'trailerTest';
  let title = movie.title;
  let trailer = movie.trailerEmbed;
  let modal = {
    id: modalId,
    trailerSRC: trailer
  }
  let $trailerButtonContainer = $('#trailerButton');
  let $trailerButton = generateTrailerModalButton(modalId);
  let $trailerModal = generateTrailerModal(modalId, movie.title, movie.trailerEmbed);
  $trailerButtonContainer.append($trailerButton);
  $('main').append($trailerModal);
  addEventListeners(modal);
}

//function to generate trailer button and to autoplay video
//trailer.js is required for this to work
async function addEventListeners(modal) {
  let id = modal.id;
  let trailerSRC = modal.trailerSRC;
  let $modal = await $('#' + id);
  $modal.on('show.bs.modal', function () {
    $('#' + id + '_embed').attr('src', trailerSRC + '?autoplay=1');
  });
  $modal.on('hide.bs.modal', function () {
    $('#' + id + '_embed').attr('src', '');
  });
  $modal.on('hidden.bs.modal', function () {
    $('#' + id + '_embed').attr('src', '');
  });
}

//function outputs html code for movie info page 
//which info is outputted depends on which movie is selected
async function generateMovieInfoBox(id, title, genre, length, plot, premier, director, actors, ageLimit, language, image, rating, imbdLink) {
  let $mainContainer = $('main');
  let $movieInfoBox = $(`
    <div id="${id}" class="container">
      <div class="card border-0 shadow my-5 movie-info">
        <div class="card-body p-5">

          <div class="row movie-title"><div class="col"><p>${title}</p></div></div>
          <div id="movieInfo" class="row">
            <div id="genre"><p><u class="category">Genre:</u>${genre}</p></div>
            <div id="movie-length"><p><u class="category">Längd:</u${length}</p></div>
          </div>
          <div class="btn1"><button id="book-button" type="button" class="btn btn-outline-danger">Boka Film</button></div>

          <div class="row">
            <div class="col-md-0.5"></div>
              <div class="row justify-content-evenly">
                <div id="moviePicture" class="col-md-4 col-xl-3 ">
                <img src="${image}" class="rounded mx-auto d-block" alt="...">
                <h5 id="rating" align="center">⭐${rating}</h5>
                </div>
                <div id="movieDescription" class="col-md-6 col-xl-7">
                <hr class="line">
                <p>${plot}</p>
                <div id="movieDetails">
                  <p class="lead" id="premier-date"><u class="category">Premier:</u>${premier}</p>
                  <p class="lead" id="movie-director"><u class="category">Regi:</u>${director}</p>
                  <p class="lead" id="movie-actors"><u class="category">Skådespelare:</u${actors}</p>
                  <p class="lead" id="age-limit"><u class="category">Åldersgräns:</u>${ageLimit}</p>
                  <p class="lead" id="language"><u class="category">Språk:</u>${language}</p>
                  <p class="lead" id="imbd"><a href="${imbdLink}"> Gå till Imbd</a></p>
                  <div id="trailerButton" class="btn2"></div>
                  <hr class="line">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
  $mainContainer.prepend($movieInfoBox);
}