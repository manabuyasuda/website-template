const resolve = require('path').resolve;
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const eslintFormatters = require('eslint/lib/cli-engine/formatters/stylish');

const isProduction = process.env.APP_ENV === 'production';

module.exports = {
  mode: process.env.APP_ENV,
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
  plugins: [new VueLoaderPlugin()],
};
