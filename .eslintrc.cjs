module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2022: true,
    node: true,
    'cypress/globals': true,
  },
  plugins: ['cypress'],
  extends: ['eslint:recommended', 'plugin:cypress/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'cypress/no-unnecessary-waiting': 'error',
  },
};
