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
