module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:react/recommended', './config/eslint/base.js', './config/eslint/import.js'],
  env: {
    browser: true,
    jest: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    camelcase: 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    'no-param-reassign': 0,
    'react/display-name': 0,
    'react/prop-types': 0,
    'import/prefer-default-export': 0,
    'no-undef': 0,
    'no-extra-semi': 0,
    'no-extra-boolean-cast': 0,
    'no-empty': 0,
    'no-prototype-builtins': 0,
    'no-constant-condition': 0,
    'react/no-unknown-property': 0,
    // suppress errors for missing 'import React' in files
    'react/react-in-jsx-scope': 'off',
    'max-len': 'off',
    'operator-linebreak': 'off',
    'nonblock-statement-body-position': 'off',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
};
