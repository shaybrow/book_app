'use strict';


const express = require('express');
const superagent = require('superagent');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const pg = require('pg');
const { get } = require('superagent');
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
client.on('error', (error) => {
  console.log(error);
});
// allows app to read form data from URLs
// boiler plate for talking to forms using POST
app.use(express.urlencoded({ extended: true }));

// loading the public folder
app.use(express.static('./public'));
app.set('view engine', 'ejs');

// displays our home page
app.get('/', getIndex);

function getIndex(req, res) {
  const sqlCheck = 'SELECT * FROM books';
  const sqlArr = [];
  client.query(sqlCheck, sqlArr)
    .then(savedBooks => {
      if (savedBooks.rows.length !== 0) {
        res.send(savedBooks.rows[0]);
      } else {
        // const sqlCheck2 = 'INSERT INTO books';
        res.render('/pages/index.ejs');
      }
    });
  // res.render('pages/index.ejs');
}


app.get('/booksearch', (req, res) => {
  res.render('pages/searches/new');
});
// sending info to googles api
app.post('/booksearch', search);
// post use searchTitles req and res
function search(req, res) {
  const search = req.body.search;
  // checking whether title or author is checked in new.ejs
  if (search[0] === 'title') {

    const url = `https://www.googleapis.com/books/v1/volumes?q=+intitle:${search[1]}`;
    superagent.get(url).then(obj => {
      const books = obj.body.items.map(item => new Book(item));

      // console.log(books);
      res.render('pages/searches/show.ejs', { books: books });
    });
  } else if (search[0] === 'author') {
    const url = `https://www.googleapis.com/books/v1/volumes?q=+inauthor:${search[1]}`;
    superagent.get(url).then(obj => {

      const books = obj.body.items.map(item => new Book(item));

      // console.log(books);
      res.render('pages/searches/show.ejs', { books: books });



    });

  }
}

function Book(book) {
  this.title = book.volumeInfo.title;
  this.author = book.volumeInfo.authors ? book.volumeInfo.authors[0] : 'Unknown';
  this.url = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'Unknown';
}



client.connect().then(() => {
  app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
});

