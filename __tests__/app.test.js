import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  let user;

  beforeAll(async () => {
    execSync('npm run recreate-tables');

    const response = await request
      .post('/api/auth/signup')
      .send({
        name: 'Me the user',
        email: 'me@user.com',
        password: 'password'
      });
    expect(response.status).toBe(200);
    user = response.body;

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
    H2H.userId = user.id;
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

    morals.userId = user.id;
    const r1 = await request.post('/api/books').send(morals);
    morals = r1.body;

    idols.userId = user.id;
    const r2 = await request.post('/api/books').send(idols);
    idols = r2.body;

    const response = await request.get('/api/books');

    expect(response.status).toBe(200);
    const expected = [H2H, morals, idols].map(book => {
      return {
        userName: user.name,
        ...book
      };
    });

    expect(response.body).toEqual(expect.arrayContaining(expected));
  });

  it('GET idols from /api/books/:id', async () => {
    const response = await request.get(`/api/books/${idols.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ...idols, userName: user.name });
  });

  it('DELETE morals from /api/books/:id', async () => {
    const response = await request.delete(`/api/books/${morals.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(morals);

    const getResponse = await request.get('/api/books');
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.find(book => book.id === morals.id)).toBeUndefined();
  });


  describe('seed data tests', () => {

    beforeAll(() => {
      execSync('npm run setup-db');
    });

    it('GET /api/books', async () => {
      // act - make the request
      const response = await request.get('/api/books');

      // was response OK (200)?
      expect(response.status).toBe(200);

      // did it return some data?
      expect(response.body.length).toBeGreaterThan(0);
      // did the data get inserted?
      expect(response.body[0]).toEqual({
        id: expect.any(Number),
        title: expect.any(String),
        genre: expect.any(String),
        url: expect.any(String),
        year: expect.any(Number),
        pages: expect.any(Number),
        wasPublished: expect.any(Boolean),
        userId: expect.any(Number),
        userName: expect.any(String)
      });
    });
  });
});