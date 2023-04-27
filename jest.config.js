module.exports = {
  testMatch: ['<rootDir>/tests/{feature,unit}/*.test.js'],
  testTimeout: 20000,
  setupFiles: ['./tests/registerHelpers.js'],
  globalTeardown: './tests/teardown.js',
}