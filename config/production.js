/**
 * 環境変数を設定します。
 * npm scriptの引数によって、開発環境と公開環境で値を出し分けることができます。
 * `process.env.NODE_ENV` => 'production'
 */
exports.defaults = {
  NODE_ENV: 'production',
}
