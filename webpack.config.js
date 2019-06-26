const path = require('path');

module.exports = (env, argv) => ({
  entry: `./src/assets/js/site.js`,

  // ファイルの出力設定
  output: {
    path: path.resolve(__dirname, 'dist/assets/js'),
    filename: 'site.js'
  }
});
