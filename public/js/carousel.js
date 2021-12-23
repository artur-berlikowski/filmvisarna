createCarousel();

function loadMovies() { return $.getJSON('/json/movies.json'); }

async function createCarousel() {
  //Grab the main container of the page
  $mainContainer = await $('main');
  //Load the movies from JSON file
  let movies = await loadMovies();
  //Get the main container for the carousel and store it in a variable
  let $carouselContainer = await $('#carouselContainer');
  let $carousel = $(`<div id="carouselPlayingNow" class="carousel slide carousel-fade"></div>`);
  let $indicators = $(`<div class="carousel-indicators"></div>`);
  let $inner = $(`<div class="carousel-inner"></div>`);

  let generatedModals = [];

  for (let i = 0; i < movies.length; i++) {
    //Get current movie title and plot
    let title = movies[i].title;
    let plot = movies[i].plot;
    let image = movies[i].imageLarge;
    let trailer = movies[i].trailerEmbed;
    //Generate indicators
    let $button = $(`<button type="button" data-bs-target="#carouselPlayingNow" data-bs-slide-to="${i}" aria-label="Slide ${(i + 1)}"></button>`);
    if (i == 0) $button.addClass('active');
    $indicators.append($button);
    //Generate slides
    let $item = $(`<div class="carousel-item"></div>`);
    let $caption = $(`<div class="carousel-caption d-none d-md-block"></div>`);
    let $title = $(`<h5>${title}</h5>`);
    let $plot = $(`<p>${plot}</p>`);

    let trailerModalId = 'trailerModal_' + i;

    //Save information about generated modal
    let generatedModal = {
      id: trailerModalId,
      trailerSRC: trailer
    };

    //Push entry into generatedModals
    generatedModals.push(generatedModal);

    let $trailerButton = generateTrailerModalButton(trailerModalId);
    let $trailer = generateTrailerModal(trailerModalId, 'Trailer - ' + title, trailer);

    if (i == 0) $item.addClass('active');
    $caption.append($title, $plot, $trailerButton);
    $item.append($caption);
    $item.css({
      'background': 'url(' + image + ')',
      'background-repeat': 'no-repeat',
      'background-size': '100% auto',
      'background-position': 'center',
      'box-shadow': 'inset 0 0 7.5vh 12vh #191919'
    });
    $inner.append($item);
    $mainContainer.append($trailer);
  }

  //Create the control buttons
  let $controls = $(`
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselPlayingNow" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselPlayingNow" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
  `);

  $carousel.append($indicators);
  $carousel.append($inner);
  $carousel.append($controls);
  $carouselContainer.append($carousel);

  //Configure the carousel with bootstrap
  let carousel = await new bootstrap.Carousel(await $carousel, {
    interval: 8000,
    keyboard: false,
    pause: 'hover',
    ride: 'carousel',
    wrap: true,
    touch: true
  });

  //Fix to start the carousel on load
  await $carousel.carousel({
    interval: 8000
  });

  addEventListeners(generatedModals);
}

async function addEventListeners(generatedModals) {
  for (modal of generatedModals) {
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
  };
}
