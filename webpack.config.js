const webpack = require('webpack');
const { resolve } = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const eslintFormatters = require('eslint/lib/cli-engine/formatters/stylish');
const StylelintPlugin = require('stylelint-webpack-plugin');

const environment = process.env.NODE_ENV || 'development';
const isProduction = environment === 'production';
const environmentConfig = require(`./config/${environment}.js`);

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
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true,
          formatter: eslintFormatters,
        },
      },
      {
        test: /\.(scss|css)$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(environmentConfig),
    }),
    new StylelintPlugin({
      context: 'src',
      files: '**/*.vue',
      configFile: '.stylelintrc',
      fix: true,
    }),
  ],
};
