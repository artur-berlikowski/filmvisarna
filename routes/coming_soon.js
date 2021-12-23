const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    pages: [
      'coming_soon'
    ],
    libs: [
      'trailer',
      'coming_soon'
    ]
  });
});

module.exports = router;