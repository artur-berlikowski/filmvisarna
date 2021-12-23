let comingSoonJson = [];
let generatedModals = [];
readFromJsonAndStartsAllFunctions();

// Reads from JSON file
async function readFromJsonAndStartsAllFunctions() {
  comingSoonJson = await $.getJSON('/json/comingSoon.json');
  await generateMovies();
  await generateTrailerModals();
  await addEventListeners();
}

async function generateMovies() {
  //Grab main container
  let $mainContainer = await $('main');
  //Generate movie html based on JSON
  for (let comingSoon of comingSoonJson) {
    let trailerId = "trailer_" + comingSoon.id;
    let trailer = comingSoon.trailerEmbed;
    generatedModals.push({
      id: trailerId,
      trailerSRC: trailer,
      title: comingSoon.title
    });
    $html = `
    <div id="movieInfo" class="container">
      <div class="row">
        <div class="col col-md-2 col-3">
          <img src="${comingSoon.image}" alt="Movie poster" class="img-fluid rounded">
        </div>
        <div class="col col-md-8 col-7 ">
          <h2>${comingSoon.title}</h2>
          <p>Premiär: ${comingSoon.premier}</p>
          <p>${comingSoon.genre}</p>
          <p>${comingSoon.ageLimit}</p>
        </div>
        <div id="trailer_button" class="col col-lg-2 col-2 align-self-center"></div>
      </div>
      <hr>
    </div>`;
    await $mainContainer.append($html);
  }
}

async function generateTrailerModals() {
  let $mainContainer = await $('main');
  $('#movieInfo #trailer_button').each(async function (index, element) {
    let $this = $(this);
    let current = generatedModals[index];
    let trailerId = current.id;
    let trailerSRC = current.trailerSRC;
    let title = current.title;
    let $trailerButton = generateTrailerModalButton(trailerId);
    let $trailerModal = generateTrailerModal(trailerId, title, trailerSRC);
    await $mainContainer.append($trailerModal);
    await $this.append($trailerButton);
  });
}

//Add trailer event listeners
async function addEventListeners() {
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
  }
}