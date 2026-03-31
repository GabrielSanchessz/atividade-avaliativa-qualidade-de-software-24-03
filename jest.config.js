module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/js/**/*.js',
    '!src/js/app.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
};
