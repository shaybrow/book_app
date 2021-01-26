'use strict';


const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const app = express();
const PORT = process.env.PORT;

// allows app to read form data from URLs
app.use(express.urlencoded({ extended: true }));

// loading the public folder
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index.ejs');
});

app.get('/booksearch', (req, res) => {
  res.render('pages/searches/new');
});
// sending info to googles api
app.post('/booksearch', searchTitle);
// post use searchTitles req and res
function searchTitle(req, res) {
  const search = req.body.search;
  // checking whether title or author is checked in new.ejs
  if (search[0] === 'title') {

    const url = `https://www.googleapis.com/books/v1/volumes?q=+intitle:${search[1]}`;
    superagent.get(url).then(obj => {
      // console.log(obj.body.items);
      res.send(obj.body.items);
    });
  } else if (search[0] === 'author') {
    const url = `https://www.googleapis.com/books/v1/volumes?q=+inauthor:${search[1]}`;
    superagent.get(url).then(obj => {
      res.send(obj.body.items);
    });

  }
}






app.listen(PORT);

