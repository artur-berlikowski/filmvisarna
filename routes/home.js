const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    pages: [
      'home',
    ],
    libs: [
      'carousel',
      'trailer',
      'dates'

    ]
  });
});

module.exports = router;