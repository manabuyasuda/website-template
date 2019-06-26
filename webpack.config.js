const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => ({
  entry: `./src/assets/js/site.js`,

  output: {
    path: path.resolve(__dirname, 'dist/assets/js'),
    filename: 'site.js'
  },

  plugins: [
    // `output.path`と未使用のassetsを削除する
    new CleanWebpackPlugin(),
  ]
})
