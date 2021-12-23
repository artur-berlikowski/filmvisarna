//Maximum amount of people per ticket
const priceAdult = 85;
const priceChild = 65;
const pricePensioner = 75;
const maxPeople = 6;
//Ids of generated elements
let generatedAuditoriums = [];
//Form parameters
let selectedMovie = ''
let selectedDate = '';
let selectedTime = '';
let amountAdult = 0;
let amountChild = 0;
let amountPensioner = 0;
let peopleTotal = 0;
let peopleRemaining = 0;
let priceTotal = 0;
let selectedAuditorium = '';
let selectedAuditoriumName = '';
let selectedSeats = [];
let seats = [];
let availableShows = [];

async function initForm() {
  //Grab containers from booking_form.html
  let $selectMovie = await $('#select_movie');
  let $selectDate = await $('#select_date');
  let $selectTime = await $('#select_time');
  let $selectPeople = await $('#select_people');
  //Initialize the bootstrap datepicker object and set options
  let $datepicker = await $('#datepicker').datepicker({
    format: "yyyy-mm-dd",
    maxViewMode: 2,
    language: 'sv',
    orientation: "auto left",
    calendarWeeks: true,
    autoclose: true,
    todayHighlight: true,
    weekStart: 1
  });
  //Grab input containers from booking_form.html
  let $inputMovie = await $('#input_movie');
  let $inputDate = await $('#input_date');
  let $inputTime = await $('#input_time');
  let $inputAdult = await $('#input_adult');
  let $inputChild = await $('#input_child');
  let $inputPensioner = await $('#input_pensioner');
  let $amountAdult = await $('#amount_adult');
  let $amountChild = await $('#amount_child');
  let $amountPensioner = await $('#amount_pensioner');

  await clearForm();
  //Add listeners
  await updateMovieSelect($inputMovie, $selectDate);
  await updateDateSelect($datepicker, $inputDate, $inputTime, $selectTime);
  await updateTimeSelect($inputTime, $selectPeople);
  await updatePeopleSelect($inputAdult, $inputChild, $inputPensioner, $amountAdult, $amountChild, $amountPensioner);
  await updateConfirmBookingButton();
  await updateCancelBookingButton();
}

async function updateMovieSelect($inputMovie, $selectDate) {
  $inputMovie.change(async function () {
    await resetAuditoriums();
    await resetPeopleSelect();
    await resetTimeSelect();
    await resetDateSelect();
    selectedMovie = $inputMovie.val() !== 'undefined' ? movies.find(movie => parseInt($inputMovie.val()) === movie.id).title : 'undefined';
    if (selectedMovie !== 'undefined') {
      $selectDate.show();
      $('#cancel_booking_button').show();
    }
    else $selectDate.hide();
  });
}

async function updateDateSelect($datepicker, $inputDate, $inputTime, $selectTime) {
  $datepicker.on('changeDate', async function () {
    await resetAuditoriums();
    await resetPeopleSelect();
    await resetTimeSelect();
    $inputDate.val(
      $datepicker.datepicker('getFormattedDate')
    );
    selectedDate = $inputDate.val();
    console.log(selectedMovie + ' ' + selectedDate);
    availableShows = shows.filter(show => selectedMovie === show.film && selectedDate === show.date);
    if (availableShows.length > 0 && availableShows !== undefined) {
      generateTimeOptions($inputTime);
      $selectTime.show();
      $('#no_show').hide();
    } else {
      $selectTime.hide();
      $('#no_show_title').html(selectedMovie);
      $('#no_show_date').html(selectedDate);
      $('#no_show').show();
    }
  });
}

async function updateTimeSelect($inputTime, $selectPeople) {
  $inputTime.on('change', async function () {
    await resetAuditoriums();
    await resetPeopleSelect();

    selectedTime = $inputTime.val();
    if (selectedTime !== 'undefined' && selectedTime !== null) {
      console.log(selectedMovie + ' ' + selectedDate + ' ' + selectedTime);
      let auditoriumName = shows.find(show => selectedMovie === show.film && selectedDate === show.date && selectedTime === show.time).auditorium;
      for (auditorium of generatedAuditoriums) {
        let currentAuditorium = '#' + auditorium;
        let $target = await $(currentAuditorium);
        let name = await $(currentAuditorium + ' #name').html();
        if (auditoriumName === name) {
          selectedAuditorium = currentAuditorium;
          selectedAuditoriumName = name;
          $target.show();
        }
      }
      $selectPeople.show();
      await updateSeatSelect();
    } else {
      $selectPeople.hide();
    }
  });
}

async function updatePeopleSelect($inputAdult, $inputChild, $inputPensioner, $amountAdult, $amountChild, $amountPensioner) {
  $inputAdult.on('change', function () {
    amountAdult = parseInt($inputAdult.val());
    $amountAdult.html(amountAdult);
    updatePeople($inputAdult, $inputChild, $inputPensioner);
  });
  $inputChild.on('change', function () {
    amountChild = parseInt($inputChild.val());
    $amountChild.html(amountChild);
    updatePeople($inputAdult, $inputChild, $inputPensioner);
  });
  $inputPensioner.on('change', function () {
    amountPensioner = parseInt($inputPensioner.val());
    $amountPensioner.html(amountPensioner);
    updatePeople($inputAdult, $inputChild, $inputPensioner);
  });
}

async function updateSeatSelect() {
  //Set global variable seats to hold all seats of the selected auditorium
  seats = await $(selectedAuditorium + ' .seat');
  //Get bookings made for selected movie, date and time
  let seatRows = auditoriums.find(auditorium => selectedAuditoriumName === auditorium.name).seatsPerRow;
  console.log(seatRows);
  let bookings = await (await $.getJSON('/json/bookings.json')).filter(booking => selectedMovie === booking.movie && selectedDate === booking.date && selectedTime === booking.time);
  let occupiedSeats = [];
  if (bookings !== undefined && bookings.length > 0) {
    //Get occupied seats
    for (booking of bookings) occupiedSeats.push(...booking.seats);
    for (seat of seats) {
      for (occupiedSeat of occupiedSeats) {
        $seat = await $(seat);
        if ($seat.attr('id') === occupiedSeat.toString()) { $seat.addClass('occupied'); }
      }
    }
  }

  $(selectedAuditorium + ' .seat').on('mouseover', async function () {
    let $this = $(this);
    let $parent = $this.parent();
    let $children = $parent.children();
    let rowId = $parent.attr('id');
    let rowLength = $children.length;
    let childIndex = $this.index();
    if (peopleTotal > 0 && !$this.hasClass('occupied') && (childIndex + peopleTotal) <= rowLength) {
      console.log('row_id: ' + rowId + ' child_index: ' + childIndex + ' row_length: ' + rowLength);
      await clearSeats(false);
      let notOccupied = true;
      //Check if any of the desired seats is occupied
      for (let i = 0; i < peopleTotal; i++) if ($parent.children().eq(childIndex + i).hasClass('occupied')) notOccupied = false;
      //If no seats in row are occupied, show selection if number of seats < rest of row
      if (notOccupied) for (let i = 0; i < peopleTotal; i++) $parent.children().eq(childIndex + i).addClass('selected');
      $this.on('click', async function () {
        if (notOccupied && peopleTotal > 0) {
          if (selectedSeats.length > 0) {
            for (seat of selectedSeats) $(selectedAuditorium + ' #' + seat.toString() + '.seat').removeClass('selection-made');
            selectedSeats = [];
          }
          for (let i = 0; i < peopleTotal; i++) {
            let $currentSeat = $parent.children().eq(childIndex + i);
            selectedSeats.push(parseInt($currentSeat.attr('id')));
            $currentSeat.addClass('selection-made');
          }
        }
        if (selectedSeats.length > 0) $('#confirm_booking_button').show();
      });
    }
  });
  $(selectedAuditorium + ' .seat').on('mouseout', async function () { await clearSeats(); });
}

async function clearSeats() {
  for (seat of seats) {
    $seat = await $(seat);
    if (!$seat.hasClass('occupied') && !$seat.hasClass('selection-made') && !$seat.parent().parent().hasClass('showcase')) {
      $seat.removeClass('selected');
    }
  }
}

async function updatePeople($inputAdult, $inputChild, $inputPensioner) {
  peopleTotal = amountAdult + amountChild + amountPensioner;
  peopleRemaining = maxPeople - peopleTotal;
  priceTotal = (amountAdult * 85) + (amountChild * 65) + (amountPensioner * 75);
  if (amountAdult > 0 && amountChild === 0 && amountPensioner == 0) {
    $inputChild.attr('max', peopleRemaining);
    $inputPensioner.attr('max', peopleRemaining);
  } else if (amountChild > 0 && amountAdult === 0 && amountPensioner === 0) {
    $inputAdult.attr('max', peopleRemaining);
    $inputPensioner.attr('max', peopleRemaining);
  } else if (amountPensioner > 0 && amountAdult === 0 && amountChild === 0) {
    $inputAdult.attr('max', peopleRemaining);
    $inputChild.attr('max', peopleRemaining);
  } else {
    $inputAdult.attr('max', amountAdult + peopleRemaining);
    $inputChild.attr('max', amountChild + peopleRemaining);
    $inputPensioner.attr('max', amountPensioner + peopleRemaining);
  }
  await $('#select_people #people_select_total span').html(peopleTotal);
  await $('#select_people #people_select_price span').html(priceTotal);
  await $('#price_adult').html(priceAdult * amountAdult);
  await $('#price_child').html(priceChild * amountChild);
  await $('#price_pensioner').html(pricePensioner * amountPensioner);
}

async function updateConfirmBookingButton() {
  let $confirmBookingButton = await $('#confirm_booking_button');
  $confirmBookingButton.on('click', async function () {
    let newBooking = {
      tickets_adult: amountAdult,
      tickets_child: amountChild,
      tickets_pensioner: amountPensioner,
      movie: selectedMovie,
      date: selectedDate,
      time: selectedTime,
      auditorium: selectedAuditoriumName,
      seats: selectedSeats,
      price: priceTotal,
      number: ''
    }
    //Generate a unique booking number
    while (newBooking.number === '' || bookings.find(booking => newBooking.number === booking.number) !== undefined) {
      newBooking.number = generateBookingNumber(newBooking.date, 11);
    }
    await createBooking(newBooking);
  });
}

async function createBooking(data) {
  bookings.push(data);
  await JSON._save('bookings', bookings);
  await window.location.replace('/booking/receipt/' + data.number);
}

function generateBookingNumber(date, length) {
  let result = 'F' + date.split('-').join('');
  for (let i = 0; i < length; i++) result += Math.floor(Math.random() * 10).toString();
  return result;
}

async function updateCancelBookingButton() {
  let $cancelBookingButton = await $('#cancel_booking_button');
  $cancelBookingButton.on('click', async function () {
    let $movieContainer = await $('#movie_container');
    clearForm();
    $movieContainer.show();
  });
}

async function removeAuditoriums() {
  if (generatedAuditoriums.length > 0 && generatedAuditoriums !== undefined) {
    for (auditorium of generatedAuditoriums) {
      let id = '#' + auditorium;
      let $auditorium = await $(id);
      $auditorium.remove();
    }
    generatedAuditoriums = [];
  }
}

async function generateTimeOptions($inputTime) {
  if (availableShows.length > 0 && availableShows !== undefined) {
    $inputTime.html(`<option value="undefined">Välj tid</option>`);
    for (show of availableShows) {
      $inputTime.append(`<option value="${show.time}">${show.time} (${show.auditorium})</option>`);
    }
  }
}

async function generateMovieOptions($inputMovie) {
  $inputMovie.html('');
  $inputMovie.append(`<option value="undefined" selected>Välj Film</option>`);
  for (movie of movies) {
    let id = movie.id;
    let title = movie.title;
    let $option = $(`<option value="${id}">${title}</option>`);
    $inputMovie.append($option);
  }
}

async function generateAuditoriums($container) {
  for (let i = 0; i < auditoriums.length; i++) {
    let auditoriumId = 'auditorium_' + i;
    let currentAuditorium = auditoriums[i];
    $auditorium = await createAuditorium(auditoriumId, currentAuditorium);
    $container.append($auditorium);
    generatedAuditoriums.push(auditoriumId);
    await generateSeats(auditoriumId, auditoriums[i].seatsPerRow);
  }
}

async function createAuditorium(id, auditorium) {
  let $auditorium = $(`
    <div id="${id}" class="container seat-booking">
      <div class="row" align="center">
        <div class="col-12">
          <p id="name">${auditorium.name}</p>
          <p>Antal platser: ${auditorium.seats}</p>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <ul class="showcase">
            <li>
              <div class="seat"></div>
              <Small>Ledig</Small>
            </li>
            <li>
              <div class="seat selected"></div>
              <Small>Vald</Small>
            </li>
            <li>
              <div class="seat occupied"></div>
              <Small>Upptagen</Small>
            </li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="seat-container">
            <div class="screen"></div>
          </div>
        </div>
      </div>
    </div>
  `);
  return $auditorium;
}

//Generate auditorium seats based on the element id and json
async function generateSeats(id, seatsPerRow) {
  let $seatContainer = await $('#' + id + ' .seat-container');
  let rowNumber = 0;
  let seatNumber = 0;
  for (row of seatsPerRow) {
    $row = $(`<div id="${rowNumber}" class="row"></div>`);
    for (let i = 0; i < row; i++) {
      $seat = $(`<div id="${seatNumber}" class="seat"></div>`);
      $row.append($seat);
      seatNumber++;
    }
    rowNumber++;
    $seatContainer.append($row);
  }
}

//Hide all auditoriums
async function hideAuditoriums() {
  if (generatedAuditoriums.length > 0 && generatedAuditoriums !== undefined) {
    for (auditorium of generatedAuditoriums) {
      let id = '#' + auditorium;
      let $auditorium = await $(id);
      $auditorium.hide();
    }
  }
}

//RESET FORMS
async function clearForm() {
  await resetConfirmBooking();
  await resetAuditoriums();
  await resetPeopleSelect();
  await resetTimeSelect();
  await resetDateSelect();
  await resetMovieSelect();
}

async function resetMovieSelect() {
  let $selectMovie = await $('#select_movie');
  let $inputMovie = await $('#input_movie');
  await generateMovieOptions($inputMovie);
  selectedMovie = 'undefined';
  $inputMovie.val(selectedMovie).change();
  $selectMovie.hide();
}

async function resetDateSelect() {
  let $selectDate = await $('#select_date');
  let $datepicker = await $('#datepicker');
  let $inputDate = await $('#input_date');
  selectedDate = '';
  await $datepicker.val('').datepicker('update');
  await $inputDate.val(selectedDate);
  await $selectDate.hide();
}

async function resetTimeSelect() {
  let $selectTime = await $('#select_time');
  let $inputTime = await $('#input_time');
  selectedTime = 'undefined';
  await $inputTime.val(selectedTime).change();
  await $selectTime.hide();
  await $('#no_show').hide();
}

async function resetPeopleSelect() {
  let $selectPeople = await $('#select_people');
  let $inputAdult = await $('#input_adult');
  let $inputChild = await $('#input_child');
  let $inputPensioner = await $('#input_pensioner');
  amountAdult = 0;
  amountChild = 0;
  amountPensioner = 0;
  peopleTotal = 0;
  peopleRemaining = 0;
  priceTotal = 0;
  await $inputAdult.val(0).change();
  await $inputChild.val(0).change();
  await $inputPensioner.val(0).change();
  await $selectPeople.hide();
}

async function resetAuditoriums() {
  selectedAuditorium = '';
  selectedAuditoriumName = '';
  selectedSeats = [];
  seats = [];
  let $auditoriumContainer = await $('#auditorium_container');
  await removeAuditoriums();
  await generateAuditoriums($auditoriumContainer);
  await hideAuditoriums();
  $('#confirm_booking').hide();
}

async function resetConfirmBooking() {
  $('#confirm_booking_button').hide();
  $('#cancel_booking_button').hide();
}