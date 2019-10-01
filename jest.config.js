module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.ts?(x)',
    '**/?(*.)+(test).ts?(x)',
  ],
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
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.(ts(x?)|js)$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: [
    '<rootDir>/setupTests.js',
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
};
