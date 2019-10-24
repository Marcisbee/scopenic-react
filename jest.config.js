module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig: '<rootDir>/config/tsconfig.jest.json',
    },
  },
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },

  testRegex: '\\.test\\.tsx?$',
  testPathIgnorePatterns: [
    '.cache/',
    'node_modules/',
    'dist/',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'json'],
  coveragePathIgnorePatterns: [
    'test_utils.ts',
    'logging/logging.ts',
    'logging/spinner.ts',
  ],
  
  maxWorkers: 1,
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/index.tsx',
    '!src/serviceWorker.ts',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 98,
      branches: 91,
      functions: 98,
      lines: 98,
    },
  },
  moduleNameMapper: {
    '.*\\.(css|less|styl|scss|sass)$':
      '<rootDir>/config/jest-mocks/cssModule.js',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/config/jest-mocks/image.js',
  },
  setupFilesAfterEnv: ['<rootDir>/config/test-setup.js'],
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
};
