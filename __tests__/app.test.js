import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  beforeAll(() => {
    execSync('npm run setup-db');
  });

  afterAll(async () => {
    return client.end();
  });

  const expectedBooks = [
    {
      id: expect.any(Number),
      title: 'The Birth of Tragedy',
      genre: 'philosophy as lit',
      url: 'covers/BoT.jpg',
      year: 1872,
      pages: 160,
      wasPublished: true
    },
    {
      id: expect.any(Number),
      title: 'On Truth and Lies in a Nonmoral Sense',
      genre: 'philosophy as lit',
      url: 'covers/TaL.jpg',
      year: 1873,
      pages: 30,
      wasPublished: false
    },
    {
      id: expect.any(Number),
      title: 'Human, All too Human',
      genre: 'philosophy as lit',
      url: 'covers/HalT.webp',
      year: 1878,
      pages: 188,
      wasPublished: true
    },
    {
      id: expect.any(Number),
      title: 'The Gay Science',
      genre: 'philosophy as lit',
      url: 'covers/tGS.jpg',
      year: 1882,
      pages: 296,
      wasPublished: true
    },
    {
      id: expect.any(Number),
      title: 'Thus Spake Zarathustra',
      genre: 'philosophy as lit',
      url: 'covers/thus.jpg',
      year: 1883,
      pages: 352,
      wasPublished: true
    },
    {
      id: expect.any(Number),
      title: 'Beyond Good and Evil',
      genre: 'philosophy as lit',
      url: 'covers/BGE.jpeg',
      year: 1886,
      pages: 288,
      wasPublished: true
    },
    {
      id: expect.any(Number),
      title: 'On The Geneology of Morality',
      genre: 'philosophy as lit',
      url: 'covers/GM.jpg',
      year: 1887,
      pages: 177,
      wasPublished: true
    },
    {
      id: expect.any(Number),
      title: 'Twilight of the Idols',
      genre: 'philosophy as lit',
      url: 'covers/TI.jpg',
      year: 1888,
      pages: 208,
      wasPublished: true
    }
  ];

  // If a GET request is made to /api/cats, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data?
  it('GET /api/books', async () => {
    // act - make the request
    const response = await request.get('/api/books');

    // was response OK (200)?
    expect(response.status).toBe(200);

    // did it return the data we expected?
    expect(response.body).toEqual(expectedBooks);

  });

  // If a GET request is made to /api/cats/:id, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data for the cat with that id?
  test('GET /api/books/:id', async () => {
    const response = await request.get('/api/books/3');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedBooks[2]);
  });
});