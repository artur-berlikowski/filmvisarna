let error = "";

init();

/*
This is the main function that finds the bookings from what's input into the form field and then have different
functions that treats the booking in different ways depending on what the user chooses.
*/

async function init() {
  let $result = await $('#result');
  let $confirm = await $('#confirm');
  let $error = await $('#error');
  let $input = await $('#search_input');
  let $button = await $('#search_button');

  $button.on('click', async function () {
    let input = await $input.val();
    let booking = await find(input);
    if (booking) {
      $error.html('');
      $result.html(`
        <div class="row" align="center">
          <div class="col-12">
            <img id="logo" width="128" height="128" src="/image/logo_light_red.svg">
          </div>
        </div>
        <div align="center" class="row">
          <div class="col-12">
            <p>Bokningsnummer<br><span id="booking_number">${booking.number}</span></p>
            <p>
              Antal Vuxna  (<span>${booking.tickets_adult}</span>) Antal Barn (<span>${booking.tickets_child}</span>) Antal Pensionärer (<span>${booking.tickets_pensioner}</span>)
            </p>
            <p>Film <span>${booking.movie}</span></p>
            <p>Datum <span>${booking.date}</span></p>
            <p>Tid <span>${booking.time}</span></p>
            <p>Sal <span>${booking.auditorium}</span></p>
            <p>Stolar <span>${booking.seats}</span></p>
            <p>Pris <span>${booking.price}</span></p>
          </div>
        </div>
        <div class="row" align="center">
          <div class="col-12">
            <button id="close_button">Stäng</button>
            <button id="remove_booking_button">Avboka</button>
          </div>
        </div>
      `);

      let $closeButton = await $('#close_button');
      let $remove_booking_button = await $('#remove_booking_button');
      let $formContainer = await $('#form_container');

      $formContainer.hide();
      $closeButton.on('click', function () {
        $result.html('');
        $formContainer.show();
      });

      /*Function for when the remove_booking_button is pressed.
      It hides the result DIV where the window with the ticket info is located.
      After this it adds a button to confirm or deny the cancellation of the ticket in the confirm div.
      If the ticket is confirmed as cancelled the $confirm_removal_button.on function clears all the content
      divs and prints the cancellation info.

      if the cancellation is denied the result div is shown again.
      */
      $remove_booking_button.on('click', async function () {
        $result.hide();
        $confirm.html(`
        <div class="row" align="center">
          <div class="col-12">
            <img id="logo" width="128" height="128" src="/image/logo_light_red.svg">
          </div>
        </div>
        <div align="center" class="row">
          <div class="col-12">
            <p><span id="confirm_text">Är du säker på att du vill avboka?<span></p>
          </div>
        </div>
        <div class="row" align="center">
          <div class="col-12">
            <button id="close_button2">Stäng</button>
            <button id="confirm_removal_button"> Avboka </button>
          </div>
        </div>
        `)
        let $confirm_removal_button = await $('#confirm_removal_button');
        let $closeButton2 = await $('#close_button2');
        $formContainer = await $('#form_container');

        $closeButton2.on('click', function () {
          $confirm.html('');
          $result.show();
        });

        $confirm_removal_button.on('click', async function () {
          $confirm.html('');
          $result.html('');
          $result.show();
          await removeBooking(input);
          $result.html(`
          <div class="row" align="center">
            <div class="col-12">
              <img id="logo" width="128" height="128" src="/image/logo_light_red.svg">
            </div>
          </div>
          <div align="center" class="row">
            <div class="col-12">
              <p>Du har avbokat boking: <br><span id="booking_number">${booking.number}</span></p>
            </div>
          </div>
          <div class="row" align="center">
            <div class="col-12">
              <button id="close_button3">Stäng</button>
            </div>
          </div>
          `);
          let $closeButton3 = await $('#close_button3');

          $closeButton3.on('click', function () {
            $result.html('');
            $formContainer.show();
          });
        })


      });

    } else if (error !== "") {
      console.log("here");
      $result.html('');
      $error.html(`<p><img src="/image/warning_sign.svg"><span class="text-danger">${error}</span></p>`);
    }
  });
}

// A function to to find the booking that is entered into the search_booking_form. If none is found a error message is returned.
async function find(input) {
  let bookings = await $.getJSON('/json/bookings.json');
  let value = input.toString();

  if (value !== "") {
    let booking = bookings.find(booking => value === booking.number);
    if (booking) {
      return booking;

    }
    error = "Det finns ingen bokning med det här bokningsnumret"
    return false;
  }
  else {
    error = "Du måste fylla i ditt bokningsnummer innan du söker"
    return false;
  }
}

//Gets the booking JSON, filter out the booking from the inputline, and then saves with JSON._save.
//This removes the booking.
async function removeBooking(input) {
  let bookings = await $.getJSON('/json/bookings.json');
  bookings = bookings.filter(bookings => bookings.number !== input);
  await JSON._save('bookings', bookings);
}

