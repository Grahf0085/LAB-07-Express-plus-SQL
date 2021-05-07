/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import books from './books.js';
import users from './users.js';

run();

async function run() {

  try {

    const data = await Promise.all(
      users.map(user => {
        return client.query(`
        INSERT INTO users(name, email, password_hash)
        VALUES($1, $2, $3)
        RETURNING *;
        `, [user.name, user.email, user.password]);
      })
    );

    const user = data[0].rows[0];

    await Promise.all(
      books.map(book => {
        return client.query(`
          INSERT INTO books (title, genre, url, year, pages, was_published, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [book.title, book.genre, book.url, book.year, book.pages, book.wasPublished, user.id]);
      })
    );

  }
  catch (err) {
    console.log(err);
  }
  finally {
    client.end();
  }

}