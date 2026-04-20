const nextJest = require('next/jest')
const path = require('path')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  // Add TypeScript support
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!next)/(?!\\u002e)/`,
  ],
  // Add typescript and babel presets
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  coverage: {
    reporter: ['text', 'json', 'lcov', 'text-summary'],
    collectCoverageFrom: [
      'app/**/*.ts',
      'app/**/*.tsx',
      'components/**/*.ts',
      'components/**/*.tsx',
      'lib/**/*.ts',
      '!**/*.test.*',
      '!**/*.spec.*',
    ],
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100,
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig) 