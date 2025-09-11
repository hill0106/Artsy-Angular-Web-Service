const request = require('supertest');
const app = require('../../server/server');

// Mock the fetchToken module
jest.mock('../../server/fetchToken', () => ({
  getToken: jest.fn(() => 'mock-token'),
  fetchToken: jest.fn()
}));

describe('Search API', () => {
  test('should return 400 when no query provided', async () => {
    const response = await request(app).get('/api/search');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No query provided');
  });

  test('should return 400 when empty query provided', async () => {
    const response = await request(app).get('/api/search?q=');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No query provided');
  });

  test('should handle search with valid query', async () => {
    // Mock axios response
    const axios = require('axios');
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: {
        _embedded: {
          artists: [
            { id: '1', name: 'Test Artist' }
          ]
        }
      }
    });

    const response = await request(app).get('/api/search?q=test');
    expect(response.status).toBe(200);
    expect(response.body._embedded.artists).toHaveLength(1);
    expect(response.body._embedded.artists[0].name).toBe('Test Artist');
  });
});
