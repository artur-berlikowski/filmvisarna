dayHeader();
loadJson();

//Todays-date calculator

let day = new Date(),
  year = day.getUTCFullYear(),
  month = day.getMonth() + 1,
  weekDay = day.getDate();
let today = `${year}-${month}-${(weekDay < 10 ? '0' : '') + weekDay}`;
console.log(today)

//day 2
let day2 = new Date(),
  year2 = day2.getUTCFullYear(),
  month2 = day2.getMonth() + 1,
  weekDay2 = day2.getDate() + 1;
let today2 = `${year2}-${month2}-${(weekDay2 < 10 ? '0' : '') + weekDay2}`;
console.log(today2)

//day 3
let day3 = new Date(),
  year3 = day3.getUTCFullYear(),
  month3 = day3.getMonth() + 1,
  weekDay3 = day3.getDate() + 2;
let today3 = `${year3}-${month3}-${(weekDay3 < 10 ? '0' : '') + weekDay3}`;
console.log(today3)

//day 4
let day4 = new Date(),
  year4 = day4.getUTCFullYear(),
  month4 = day4.getMonth() + 1,
  weekDay4 = day4.getDate() + 3;
let today4 = `${year4}-${month4}-${(weekDay4 < 10 ? '0' : '') + weekDay4}`;
console.log(today4)

//day 5
let day5 = new Date(),
  year5 = day5.getUTCFullYear(),
  month5 = day5.getMonth() + 1,
  weekDay5 = day5.getDate() + 4;
let today5 = `${year5}-${month5}-${(weekDay5 < 10 ? '0' : '') + weekDay5}`;
console.log(today5)

//day 6
let day6 = new Date(),
  year6 = day6.getUTCFullYear(),
  month6 = day6.getMonth() + 1,
  weekDay6 = day6.getDate() + 5;
let today6 = `${year6}-${month6}-${(weekDay6 < 10 ? '0' : '') + weekDay6}`;
console.log(today6)

//Next weeks-date calculator
let day7 = new Date(),
  year7 = day7.getUTCFullYear(),
  month7 = day7.getMonth() + 1,
  weekDay7 = day7.getDate() + 6;

let today7 = `${year7}-${month7}-${weekDay7}`;

console.log(today7)


function dayHeader() {
  fetch("json/daysHeader.json")
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {

      for (let i = 0; i < data.length; i++) {

        const day1 = document.querySelector(".day1");
        const day2 = document.querySelector(".day2");
        const day3 = document.querySelector(".day3");
        const day4 = document.querySelector(".day4");
        const day5 = document.querySelector(".day5");
        const day6 = document.querySelector(".day6");
        const day7 = document.querySelector(".day7");

        let day = data[i].day;
        let date = data[i].date;

        let textH = `<div class="headerStyle"> ${day} ${date} </div> `;

        if (today <= data[i].date && data[i].date <= today7) {

          if (date == today) {
            day1.innerHTML += textH;
          }
          if (date == today2) {
            day2.innerHTML += textH;
          }
          if (date == today3) {
            day3.innerHTML += textH;
          }
          if (date == today4) {
            day4.innerHTML += textH;
          }
          if (date == today5) {
            day5.innerHTML += textH;
          }
          if (date == today6) {
            day6.innerHTML += textH;
          }
          if (date == today7) {
            day7.innerHTML += textH;
          }

        }
      }
    })
    .catch(function (err) {
      console.log(err)
    });
}

// Function for the big salon
function loadJson() {
  fetch("json/shows.json ")
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      for (let i = 0; i < data.length; i++) {

        const monday = document.querySelector(".monday");
        const tuesday = document.querySelector(".tuesday");
        const wednesday = document.querySelector(".wednesday");
        const thursday = document.querySelector(".thursday");
        const friday = document.querySelector(".friday");
        const saturday = document.querySelector(".saturday");
        const sunday = document.querySelector(".sunday");

        let aud = data[i].auditorium;
        let img = data[i].img;
        let film = data[i].film;
        let time = data[i].time;
        let date = data[i].date;
        let day = data[i].day;

        let texts = `<img class="imageGenerator"  src=${img}>  <p class="line1">  </p> <div class="film"  <div class="film"> ${film} </div>  <div class="aud"> ${aud}</div>   <div class="time">${time} </div>`

        if (today <= data[i].date && data[i].date <= today7) {

          if (day === 'Måndag') {
            monday.innerHTML += texts;
          }
          if (day === 'Tisdag') {
            tuesday.innerHTML += texts;
          }
          if (day === 'Onsdag') {
            wednesday.innerHTML += texts;
          }
          if (day === 'Torsdag') {
            thursday.innerHTML += texts;
          }
          if (day === 'Fredag') {
            friday.innerHTML += texts;
          }
          if (day === 'Lördag') {
            saturday.innerHTML += texts;
          }
          if (day === 'Söndag') {
            sunday.innerHTML += texts;
          }
        }
      }
    })
    .catch(function (err) {
      console.log(err)
    });
}
