'use strict';

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const app = express();

// allows app to read form data from URLs
app.use(express.urlencoded({extended: true}));

// loading the public folder
app.use(express.static('./public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index.ejs');
});



app.listen(3000);
