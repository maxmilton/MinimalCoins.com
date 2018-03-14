'use strict';

module.exports = {
  root: true,
  extends: [
    '@wearegenki/eslint-config',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
  },
  rules: {
    'function-paren-newline': ['error', 'consistent'],
  },
};
