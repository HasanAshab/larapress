const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  testMatch: ['<rootDir>/tests/{feature,unit}/**/*.test.js'],
  testTimeout: 20000,
  setupFiles: ['./tests/connectDB.js', './tests/registerHelpers.js'],
  globalTeardown: './tests/teardown.js',
  modulePaths: [compilerOptions.baseUrl],
  preset: 'ts-jest',
}


