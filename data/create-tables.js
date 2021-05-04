/* eslint-disable no-console */
import client from '../lib/client.js';

// async/await needs to run in a function
run();

async function run() {

  try {

    // run a query to create tables
    await client.query(`          
      CREATE TABLE books (
        id SERIAL PRIMARY KEY NOT NULL,
        title VARCHAR(512) NOT NULL,
        genre VARCHAR(512) NOT NULL,
        url VARCHAR(1024) NOT NULL,
        year INTEGER NOT NULL,
        pages INTEGER NOT NULL,
        was_published BOOLEAN DEFAULT TRUE
      );
    `);

    console.log('create tables complete');
  }
  catch (err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}