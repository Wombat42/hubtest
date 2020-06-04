module.exports = {
  extends: ['react-app', 'airbnb', 'prettier', 'prettier/react'],
  plugins: ['prettier', 'react-hooks'],
  parser: 'babel-eslint',
  rules: {
    'prettier/prettier': ['error'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    /* turned off by Material-ui cause it is a massive hassle */
    'react/jsx-props-no-spreading': 'off',
    'no-plusplus': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src', ''],
      },
    },
  },
};
