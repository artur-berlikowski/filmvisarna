function generateTrailerModalButton(id) {
  let $button = $(`
    <button type="button" class="btn btn-primary trailer-button" data-bs-toggle="modal" data-bs-target="#${id}">
      <img src="/image/trailer_play_button.svg">
      <span>Se Trailer</span>
    </button>
  `);
  return $button;
}

function generateTrailerModal(id, title, embed) {
  let $modal = $(`
    <div class="modal fade" id="${id}" data-bs-backdrop="static"
      data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title trailer-title" id="staticBackdropLabel">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="embed-responsive embed-responsive-16by9">
              <iframe id="${id + '_embed'}" class="embed-responsive-item" width="560" height="315" src="${embed}" allowfullscreen></iframe>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Stäng</button>
          </div>
        </div>
      </div>
    </div>
  `);
  return $modal;
}