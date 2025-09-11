const request = require('supertest');
const app = require('../server/server');

describe('Server', () => {
  test('should respond to GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  test('should serve static files', async () => {
    const response = await request(app).get('/');
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });
});
