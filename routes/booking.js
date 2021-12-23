const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const router = express.Router();

let bookings = require('./../public/json/bookings.json');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', (req, res) => {
  res.render('index', {
    pages: [
      'booking_form'
    ],
    libs: [
      'trailer',
      'booking_form',
      'booking'
    ]
  });
});

router.get('/search', (req, res) => {
  res.render('index', {
    pages: [
      'booking_search'
    ],
    libs: [
      'booking_search'
    ]
  });
})

router.get('/search/:booking_number', (req, res) => {
  let number = req.params.booking_number;
  let booking = bookings.find(booking => number === booking.number);
  res.json(booking || null);
});

router.post('/create', (req, res) => {
  if (req.is('application/json')) {
    res.json(req.body);
  }
});

router.get('/receipt/:booking_number', (req, res) => {
  let bookings = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/../public/json/bookings.json'), 'utf-8'));
  let booking = bookings.find(booking => req.params.booking_number === booking.number);
  if (booking !== undefined) {
    res.render('index', {
      ejs: [
        'booking/receipt/receipt'
      ],
      data: booking
    });
  } else {
    res.render('index', {
      ejs: [
        'booking/receipt/receipt_error'
      ],
      error: 'Hittade ingen bokning med bokningsnummer "' + req.params.booking_number + '".'
    });
  }
});

module.exports = router;