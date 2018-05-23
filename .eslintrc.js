// https://eslint.org/docs/user-guide/configuring

'use strict';

module.exports = {
  root: true,
  extends: [
    '@minna-ui/eslint-config',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'function-paren-newline': ['error', 'consistent'],
    'no-param-reassign': ['error', { ignorePropertyModificationsFor: [
      'el',
      'state',
    ]}],
  },
};
