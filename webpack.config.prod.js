const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  externals: {
    react: 'React', // Case matters here
    'react-dom': 'ReactDOM', // Case matters here
  },
});
