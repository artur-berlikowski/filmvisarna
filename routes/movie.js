const express = require('express');
const http = require('http');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    pages: [
      'movies'
    ],
    libs: [
      'trailer',
      'movies'
    ]
  });
});

router.get('/search', (req, res) => {
  res.render('index', {
    pages: [
      'movie_search'
    ],
    libs: [
      'movie_search'
    ]
  });
})

module.exports = router;