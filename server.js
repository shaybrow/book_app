'use strict';


const express = require('express');
const superagent = require('superagent');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const pg = require('pg');
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
//these are our routes
app.get('/', getIndex);
// app.get('/books', getSearchForm);
// app.get('/books/:id', getDetails);
app.get('/booksearch', searchPage);
app.post('/booksearch', getBookSearch);
app.post('/save', saveBooks);

function saveBooks(req, res) {
  const sqlSend = 'INSERT INTO books (title, author) VALUES ($1, $2) RETURNING ID';
  const array = [req.body.title, req.body.author];
  client.query(sqlSend, array).then(() => {
    res.send('save');
  });
}

function searchPage(req, res) {
  res.render('pages/searches/new');
}

function getIndex(req, res) {
  const sqlCheck = 'SELECT * FROM books';

  client.query(sqlCheck)
    .then(savedBooks => {

      // const sqlCheck2 = 'INSERT INTO books';
      res.render('./pages/index.ejs', { books: savedBooks.rows });

    });
  // res.render('pages/index.ejs');
}

// function getBooksDb(req, res) {
//   const sqlSend = 'SELECT * FROM books';
//   client.query(sqlSend).then(obj => {
//     res.render('./pages/index.ejs', { books: obj.rows });
//   });
// }

function getBookSearch(req, res) {

  // sending info to googles api

  // post use searchTitles req and res
  const search = req.body.search;
  console.log(req.body);
  // checking whether title or author is checked in new.ejs
  if (search[0] === 'title') {

    const url = `https://www.googleapis.com/books/v1/volumes?q=+intitle:${search[1]}`;
    superagent.get(url).then(obj => {
      const books = obj.body.items.map(item => new Book(item));
      // const sqlSend = 'INSERT INTO books (title, author, url';
      // books.forEach(obj => {
      //   const sqlArr = [books[obj].title, books[obj].author, books[obj].url];
      //   client.query(sqlSend, sqlArr);

      res.render('pages/searches/show', { books: books });
    });

  }
  else if (search[0] === 'author') {
    const url = `https://www.googleapis.com/books/v1/volumes?q=+inauthor:${search[1]}`;
    superagent.get(url).then(obj => {

      const books = obj.body.items.map(item => new Book(item));
      // const sqlSend = 'INSERT INTO books (title, author, url';
      // books.forEach(obj => {
      //   const sqlArr = [books[obj].title, books[obj].author, books[obj].url];
      //   client.query(sqlSend, sqlArr);
      // });

      res.render('pages/searches/show', { books: books });

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

