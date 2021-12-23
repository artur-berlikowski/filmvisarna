const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    libs: [
      'booking_reciept'
    ]
  });
});

module.exports = router;