const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg
  },
  testMatch: [
    '**/*.spec.ts'
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  // Collect coverage from all src files except tests and DB bootstrap
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/server.ts',
    '!src/database/migrations/**',
    '!src/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  // Give each test file up to 30 seconds (bcrypt hashing is slow in some envs)
  testTimeout: 30000,
  // Silence verbose noisy logs from modules during tests
  silent: false,
  // Run integration tests and unit tests from the same runner
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/src/__tests__/setup.ts']
};