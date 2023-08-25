const { compilerOptions } = require("./tsconfig.json");

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
  modulePaths: ["<rootDir>"],
  preset: "ts-jest",
  testEnvironment: "node",
  forceExit: true,
};
