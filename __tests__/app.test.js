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

  it('POST H2H to /api/books', async () => {
    const response = await request
      .post('/api/books')
      .send(H2H);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(H2H);

    H2H = response.body;
  });

  it('PUT H2H to /api/books', async () => {

    H2H.year = 1000;

    const response = await request
      .put(`/api/books/${H2H.id}`)
      .send(H2H);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(H2H);

    H2H = response.body;
  });

  it('GET list of books from /api/books', async () => {
    const r1 = await request.post('/api/books').send(morals);
    morals = r1.body;
    const r2 = await request.post('/api/books').send(idols);
    idols = r2.body;

    const response = await request.get('/api/books');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([H2H, morals, idols]));
  });

  it('GET idols from /api/books/:id', async () => {
    const response = await request.get(`/api/books/${idols.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(idols);
  });

  it('DELETE morals from /api/books/:id', async () => {
    const response = await request.delete(`/api/books/${morals.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(morals);

    const getResponse = await request.get('/api/books');
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual(expect.arrayContaining([H2H, idols]));
  });

});

