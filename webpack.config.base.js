const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: ['react-hot-loader/patch', 'src/index.jsx'],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
        },
      },
    ],
  },
  externals: {
    react: 'React', // Case matters here
    'react-dom': 'ReactDOM', // Case matters here
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
      src: path.resolve(__dirname, './src'),
    },
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    libraryTarget: 'umd',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'hubtest.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
