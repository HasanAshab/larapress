//const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  testMatch: ['<rootDir>/tests/{feature,unit}/**/*.test.js'],
  testTimeout: 20000,
  setupFiles: ['./tests/registerHelpers.js'],
  globalTeardown: './tests/teardown.js',
  modulePaths: [compilerOptions.baseUrl],
  preset: 'ts-jest',
  //moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  /*
  moduleNameMapper: {
    "^@/(.*)": "<rootDir>/$1"
  },
  */
  
}


