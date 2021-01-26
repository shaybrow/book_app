'use strict';


const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const app = express();

// allows app to read form data from URLs
app.use(express.urlencoded({ extended: true }));

// loading the public folder
app.use(express.static('./public'));

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
      const book = new Book(obj);
      res.send(book);
    });
  } else if (search[0] === 'author') {
    const url = `https://www.googleapis.com/books/v1/volumes?q=+inauthor:${search[1]}`;
    superagent.get(url).then(obj => {
      const book = new Book(obj);
      console.log(book);
      res.send(book);
    });

  }
}

function Book(obj) {
  this.title = obj.body.items[0].title;
  this.authorName = obj.body.items[0].authors;
  this.description = obj.body.items[0].description;
  this.url = obj.body.items[0].imageLinks;
}




app.listen(3000);

