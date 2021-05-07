/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

// heartbeat route
app.get('/', (req, res) => {
  res.send('Best Books API');
});

// API routes,
app.get('/api/books', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id,
              title,
              genre,
              url,
              year,
              pages,
              was_published as "wasPublished"
      FROM    books;
    `);

    // send back the data
    res.json(data.rows);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const user = req.body;
    const data = await client.query(`
      INSERT INTO users(name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email;
      `, [user.name, user.email, user.password]);

    res.json(data.rows[0]);

  }

  catch (err) {
    console.log('err');
    res.status(500).json({ error: err.message });
  }

});

app.get('/api/books/:id', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id,
              title,
              genre,
              url,
              year,
              pages,
              was_published as "wasPublished"
      FROM    books
      WHERE   id = $1;
    `, [req.params.id]);

    // send back the data
    res.json(data.rows[0] || null);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/books', async (req, res) => {
  // use SQL query to get data...
  try {
    const book = req.body;
    const data = await client.query(`
    INSERT INTO books (title, genre, url, year, pages, was_published, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, title, genre, url, year, pages, was_published as "wasPublished", user_id as "userId";
    `, [book.title, book.genre, book.url, book.year, book.pages, book.wasPublished, book.userId]);

    // send back the data
    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/books/:id', async (req, res) => {
  try {
    const book = req.body;

    const data = await client.query(`
      UPDATE  books 
        SET   title = $1, genre = $2, url = $3, 
              year = $4, pages = $5, was_published = $6
      WHERE   id = $7
      RETURNING id, title, genre, url, year, pages, was_published as "wasPublished";
    `, [book.title, book.genre, book.url, book.year, book.pages, book.wasPublished, req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM books 
      WHERE id = $1
      RETURNING id, title, genre, url, year, pages, was_published as "wasPublished";
    `, [req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default app;