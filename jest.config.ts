import type { Config } from 'jest';

const config: Config = {
  automock: false,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/**/types.ts',
    '!<rootDir>/src/landingTemplate.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: [
    '/src/controller/',
  ],
  coverageProvider: 'babel',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  resetModules: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'node',
  testEnvironmentOptions: {
    globalsCleanup: 'on',
  },
  transform: {
    '^.+.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.dev.json',
    }],
  },
  modulePathIgnorePatterns: [
    '<rootDir>/dist',
  ],
};

export default config;
