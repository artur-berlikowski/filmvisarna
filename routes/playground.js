const express = require('express');
const router = express.Router();

router.get('/artur', (req, res) => {
  res.render('index', {
    modules: [
      'playground'
    ]
  });
});

module.exports = router;