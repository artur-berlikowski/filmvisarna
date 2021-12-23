// Contact us form
//gives error messages if given unvalid values
function validate() {
  var name = document.getElementById("name").value;
  var subject = document.getElementById("subject").value;
  var phone = document.getElementById("phone").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;
  var error_message = document.getElementById("errorMessage");

  error_message.style.padding = "10px";
  error_message.style.background = "#881414";

  var text;
  if (name.length < 4) {
    text = "Vänligen ange ett giltigt namn";
    error_message.innerHTML = text;
    return false;
  }
  if (subject.length < 1) {
    text = "Vänligen ange ett ämne";
    error_message.innerHTML = text;
    return false;
  }
  if (isNaN(phone) || phone.length != 10) {
    text = "Vänligen ange ett giltigt mobilnummer";
    error_message.innerHTML = text;
    return false;
  }
  if (email.indexOf("@") == -1 || email.length < 6) {
    text = "Vänligen ange giltig e-postadress";
    error_message.innerHTML = text;
    return false;
  }
  if (message.length === 0) {
    text = "Vänligen ange ett meddelande";
    error_message.innerHTML = text;
    return false;
  }
  text = "Formuläret har skickats in!";
  error_message.innerHTML = text;
  error_message.style.background = "green";
  return false;
}

// Json to HTML (auditoriums and seats)
//outputs the auditoriums names and amount seats on about us page.
let auditoriums;

async function readAuditoriumsFromJson() {
  auditoriums = await (await fetch('json/auditorium.json')).json();
  renderAuditoriumsToScreen()
}

readAuditoriumsFromJson()

function renderAuditoriumsToScreen() {
  for (let auditorium of auditoriums) {
    $('#auditorium-list').append(`
        <li>${auditorium.name}, med ${auditorium.seats} platser</li>
        `
    )
  }
}

// Json to HTMl (prices)
//outputs prices for each movie ticket
let prices;

async function readPricesFromJson() {
  prices = await (await fetch('json/prices.json')).json();
  renderPricesToScreen()
}

readPricesFromJson()

function renderPricesToScreen() {
  for (let price of prices) {
    $('#prices-list').append(`
        <li>${price.customer}: ${price.price}kr</li>
        `
    )
  }
}




