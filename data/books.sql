DROP TABLE books;

CREATE TABLE books(
  id SERIAL PRIMARY KEY,
  title VARCHAR,
  author VARCHAR,
  image_url VARCHAR
)
