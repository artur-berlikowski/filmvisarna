createBookingReceipt('F211121001');

// Reads from JSON file "bookings" at specific booking number.
// Creats variables for each info needed for html file later
async function createBookingReceipt(bookingNumber) {
  let $mainContainer = await $('main');
  let bookingRawData = await $.getJSON('/json/bookings.json');
  let booking = bookingRawData.find(booking => bookingNumber === booking.number);
  let title = booking.movie;
  let date = booking.date;
  let time = booking.time;
  let auditorium = booking.auditorium;
  let price = booking.price;
  let bookingNumberForHtml = bookingNumber;
  let numberOfSeats = Object.keys(booking.seats).length;
  let seats = booking.seats.join(', ');
  let adults = booking.tickets_adult;
  let kids = booking.tickets_child;
  let pensioner = booking.tickets_pensioner;
  // Calls the generateReceipt method with all needed variables to be used
  $mainContainer.append(generateReceipt(title, date, time, auditorium, price, bookingNumberForHtml, numberOfSeats, seats, adults, kids, pensioner));
}

// Takes in all variables created in createBookingReceipt method 
function generateReceipt(title, date, time, auditorium, price, bookingNumber, numberOfSeats, seats, adults, kids, pensioner) {
  let $html = (`<div id="recieptContainer" class="container">
  <div id="logo" class="row">
    <div class="col-2 mx-auto">
      <img class="img-fluid" src="/image/logo.svg">
    </div>
  </div>
  <div id="bigText" class="row">
    <div class="col">
      <h1>Tack för din bokning</h1>
    </div>
  </div>

  <div class="row">
    <div id="movieTitel" class="col">
      <h3>${title}</h3>
    </div>
  </div>
  <hr id="receiptHr">
  <div class="bookingDetails">

  <div id="bookingDetailsUpper" class="row">
    <div class="col-md-4 ">
      <h4>Datum:</h4>
      <p>${date}</p>
    </div>
    <div class="col-md-4">
      <h4>Tid:</h4>
      <p>${time}</p>
    </div>
    <div class="col">
      <h4>Bokningsnummmer:</h4>
      <p>${bookingNumber}
    </div>
  </div>
  <div id="bookingDetailsMiddle" class="row">
    <div class="col-md-4">
      <h4>Salong:</h4>
      <p>${auditorium}</p>
    </div>
  <div class="col-md-4">
    <h4>Pris:</h4>
    <p>${price} kr</p>
  </div>
    <div class="col-md-4">
      <h4>Antal platser:</h4>
      <p>${numberOfSeats}</p>
  </div>
</div>
  
<div id="bookingDetailsBottom" class="row">
    <div class="col-md-4">
      <h4>Radnummer:</h4>
      <p>5</p>
    </div>
    <div class="col-md-4">
      <h4>Stolsnummer:</h4>
      <p>${seats}</p>
    </div>
      <div id="visitors"class="col-md-4">
       <h4>Besökare:</h4>
        <p>Vuxna: ${adults} </p>
        <p>Barn: ${kids}</p>
        <p>Pensionärer: ${pensioner} </p>
      </div>
    </div>
  </div>
</div>
  `);
  return $html;
}

