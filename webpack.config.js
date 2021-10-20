const webpack = require('webpack');
const { resolve } = require('path');
const eslintFormatters = require('eslint/lib/cli-engine/formatters/stylish');

const environment = process.env.NODE_ENV || 'development';
const isProduction = environment === 'production';
const environmentConfig = require(`./config/${environment}.js`); // eslint-disable-line

module.exports = {
  mode: environment,
  entry: {
    site: resolve(__dirname, 'src/assets/js/site.js'),
  },
  output: {
    path: resolve(__dirname, 'htdocs/assets/js'),
    filename: `[name].js`,
  },
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        enforce: 'pre',
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true,
          formatter: eslintFormatters,
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(environmentConfig),
    }),
  ],
};
