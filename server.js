const express = require('express');
const jsonflex = require('jsonflex')({ jsonDir: '/public/json' });
const path = require('path');
const app = express();
const port = 3000;

app.use(jsonflex);
app.use(express.static('public'));

app.set('view engine', 'ejs');

const homeRouter = require(path.resolve(__dirname + '/routes/home'));
const aboutRouter = require(path.resolve(__dirname + '/routes/about'));
const moviesRouter = require(path.resolve(__dirname + '/routes/movie'));
const bookingRouter = require(path.resolve(__dirname + '/routes/booking'));
const receiptRouter = require(path.resolve(__dirname + '/routes/receipt'));
const comingSoonRouter = require(path.resolve(__dirname + '/routes/coming_soon'));
const playgroundRouter = require(path.resolve(__dirname + '/routes/playground'));

app.use('/', homeRouter);
app.use('/about', aboutRouter);
app.use('/movie', moviesRouter);
app.use('/booking', bookingRouter);
app.use('/receipt', receiptRouter);
app.use('/coming_soon', comingSoonRouter);
app.use('/playground', playgroundRouter)

app.listen(port, () => {
  console.log(`Express JS Server Listening on ${port}`);
});