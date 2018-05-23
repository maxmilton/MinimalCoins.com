// https://facebook.github.io/jest/docs/en/configuration.html

'use strict';

module.exports = {
  preset: '@minna-ui/jest-config',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.css$': '@minna-ui/jest-config/lib/null-transform.js',
  },
  moduleFileExtensions: [
    'js',
    'jsx',
  ],
  setupFiles: ['<rootDir>/test/__setup__.js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
  ],
  coverageDirectory: '<rootDir>/test/coverage',
};
