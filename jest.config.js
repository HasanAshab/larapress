const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  testMatch: ["<rootDir>/tests/{feature,unit}/**/*.test.js"],
  testTimeout: 23000,
  setupFiles: [
    "./tests/registerHelpers.js",
  ],
  modulePaths: [compilerOptions.baseUrl],
  preset: "ts-jest",
  testEnvironment: 'node',
  forceExit: true,
};
