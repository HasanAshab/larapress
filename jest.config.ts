import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  globals: {
    'ts-jest': {
      diagnostics: {
        exclude: ["**"],
        //exclude: ['!**/*.(spec|test).ts?(x)'],
      },
    },
  },
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testMatch: ["<rootDir>/tests/{feature,unit}/**/*.test.ts"],
  testTimeout: 10000000,
  setupFilesAfterEnv: [
    "./tests/registerHelpers.ts",
    "./tests/overrideHooks.ts",
    "./tests/customMatchers.ts"
  ],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/$1",
    "^helpers$": "<rootDir>/core/helpers",
    "^types/(.*)$": "<rootDir>/types/$1"
  },
  modulePaths: ['<rootDir>/core/utils/'],
  forceExit: true
};

export default config;