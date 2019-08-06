const BROWSER_DEFAULT_FONT_SIZE = 16;

/**
 * メディアクエリ変数を管理して、`this.match(query, layoutChangedCallback)`で`query`が一致するか判定します。
 * @example
 * import MediaQuery from './MediaQuery';
 * const mediaQuery = new MediaQuery();
 */
export default class MediaQuery {
  constructor() {
    this.sm = 375;
    this.md = 768;
    this.lg = 1024;
    this.xl = 1440;
  }

  /**
   * メディアクエリがロードで判定またはリサイズで判定が切り替わったときに、コールバックで真偽値を返します。
   * @link https://github.com/yuheiy/real-world-website-boilerplate/blob/master/src/js/mediaQuery.js
   * @param {(String | Number)} query - メディアクエリ文字列（`this.queries`）か数値
   * @param {boolean} layoutChangedCallback - メディアクエリが一致するかの真偽値
   * @example
   * mediaQuery.match('md', matches => {
   *   console.log(matches ? 'md' : 'sm');
   * });
   * mediaQuery.match(768, matches => {
   *   console.log(matches ? '768以上' : '767以下');
   * });
   */
  match(query, layoutChangedCallback) {
    let mediaQuery = `(min-width: ${this[query] / BROWSER_DEFAULT_FONT_SIZE}em)`;

    if (typeof query === 'number') {
      mediaQuery = `(min-width: ${query / BROWSER_DEFAULT_FONT_SIZE}em)`;
    }

    const mql = window.matchMedia(mediaQuery);
    const listener = event => {
      layoutChangedCallback(event.matches);
    };
    mql.addListener(listener);
    layoutChangedCallback(mql.matches);
    const uninstall = () => {
      mql.removeListener(listener);
    };
    return uninstall;
  }
}
