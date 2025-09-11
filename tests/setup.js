// Jest setup file
process.env.NODE_ENV = 'test';
process.env.JWTPRIVATEKEY = 'test-jwt-key';
process.env.SALT = '10';
process.env.DB = 'mongodb://localhost:27017/artsy-test';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock database connection
jest.mock('../server/db', () => ({
  connection: jest.fn()
}));

// Mock fetchToken module
jest.mock('../server/fetchToken', () => ({
  getToken: jest.fn(() => 'mock-token'),
  fetchToken: jest.fn()
}));

// Mock axios
jest.mock('axios');
