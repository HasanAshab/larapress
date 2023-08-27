module.exports = {
  globals: {
    "ts-jest": {
      diagnostics: {
        exclude: ["**"],
      },
    },
  },
  testMatch: ["<rootDir>/tests/{feature,unit}/**/*.test.js"],
  testTimeout: 10000000,
  setupFilesAfterEnv: [
    "./tests/registerHelpers.js",
    "./tests/customMatchers.js"
  ],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/$1",
    "^helpers$": "<rootDir>/helpers",
    "^types/(.*)$": "<rootDir>/types/$1"
  },
  modulePaths: ['<rootDir>/illuminate/utils/'],
  preset: "ts-jest",
  testEnvironment: "node",
  forceExit: true
};