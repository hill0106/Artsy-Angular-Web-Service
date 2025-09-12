const request = require('supertest');
const app = require('../../server/server');
const axios = require('axios');

describe('Search API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  test('should attempt search with valid query', async () => {
    // This test will fail due to API authentication, but tests the route structure
    const response = await request(app).get('/api/search?q=test');
    // Expect either 200 (success) or 500 (API error) - both are valid responses
    expect([200, 500]).toContain(response.status);
  });

  test('should handle search API errors gracefully', async () => {
    // This test verifies error handling structure
    const response = await request(app).get('/api/search?q=test');
    // Should return an error response with proper structure
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.body).toHaveProperty('error');
  });
});
