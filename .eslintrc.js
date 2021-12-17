module.exports = {
  extends: ['eslint-config-airbnb', 'eslint-config-prettier'],
  globals: {
    getApp: 'readonly',
  },
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'no-new': 'off',
  },
};
