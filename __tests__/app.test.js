import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  // beforeAll(() => {
  //   execSync('npm run setup-db');
  // });

  beforeAll(() => {
    execSync('npm run recreate-tables');
  });

  afterAll(async () => {
    return client.end();
  });

  let H2H = {
    id: expect.any(Number),
    title: 'Human, All too Human',
    genre: 'philosophy as lit',
    url: 'covers/HalT.webp',
    year: 1878,
    pages: 188,
    wasPublished: true
  };

  let BGE = {
    id: expect.any(Number),
    title: 'Beyond Good and Evil',
    genre: 'philosophy as lit',
    url: 'covers/BGE.jpeg',
    year: 1886,
    pages: 288,
    wasPublished: true
  };

  let morals = {
    id: expect.any(Number),
    title: 'On The Geneology of Morality',
    genre: 'philosophy as lit',
    url: 'covers/GM.jpg',
    year: 1887,
    pages: 177,
    wasPublished: true
  };

  let idols = {
    id: expect.any(Number),
    title: 'Twilight of the Idols',
    genre: 'philosophy as lit',
    url: 'covers/TI.jpg',
    year: 1888,
    pages: 208,
    wasPublished: true
  };

  it.only('POST H2H to /api/books', async () => {
    const response = await request
      .post('/api/books')
      .send(H2H);
    console.log(response.text);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(H2H);

    H2H = response.body;
  });


  it('POST /api/books/H2H', async () => {
    // act - make the request
    const response = await request.post('/api/books/H2H');

    // was response OK (200)?
    expect(response.status).toBe(200);

    // did it return the data we expected?
    expect(response.body).toEqual(H2H);

  });
});