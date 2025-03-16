const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Manga = require('../models/Manga');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('POST /api/manga', () => {
  it('deve criar um novo mangá com autenticação válida', async () => {
    const res = await request(app)
      .post('/api/manga')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        title: 'Test Manga',
        author: 'Test Author',
        genre: ['Shonen']
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });
}); 