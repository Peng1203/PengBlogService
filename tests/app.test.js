const request = require('supertest');
const app = require('../src/app');

describe('Test the root path', () => {
  test('It should respond with 200 status code', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});
