'use strict'; // eslint-disable-line

module.exports = {
  // preset: '@wearegenki/test',

  transform: {
    '^.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff2?)$': '@wearegenki/test/lib/null-transform.js',
    '^.+\\.js?$': 'babel-jest',
  },
  testPathIgnorePatterns: [
    '/coverage/',
    '/dist/',
    '/node_modules/',
    '/\\.vscode/',
    '/\\.eslintcache/',
    '/\\.git/',
  ],
  collectCoverageFrom: ['/src/**/*.{js,jsx}'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  coverageDirectory: '<rootDir>/test/coverage',
};
