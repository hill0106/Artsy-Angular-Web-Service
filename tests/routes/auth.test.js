const request = require('supertest');
const app = require('../../server/server');

// Mock the User model
jest.mock('../../server/models/user', () => ({
  User: {
    findOne: jest.fn(),
    findById: jest.fn()
  },
  validate: jest.fn()
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  genSalt: jest.fn(),
  hash: jest.fn()
}));

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 for login without credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({});
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid email or password');
  });

  test('should handle logout', async () => {
    const response = await request(app)
      .post('/api/auth/logout')
      .send({});
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logged out successfully');
  });

  test('should return 400 for signup without required fields', async () => {
    const { validate } = require('../../server/models/user');
    validate.mockReturnValue({ error: { details: [{ message: 'Email is required' }] } });

    const response = await request(app)
      .post('/api/user/signup')
      .send({});
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email is required');
  });
});
