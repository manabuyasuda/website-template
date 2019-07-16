const BROWSER_DEFAULT_FONT_SIZE = 16;

export const MEDIA_QUERY_SMALL = `(min-width: ${375 / BROWSER_DEFAULT_FONT_SIZE}em)`;
export const MEDIA_QUERY_MEDIUM = `(min-width: ${768 / BROWSER_DEFAULT_FONT_SIZE}em)`;
export const MEDIA_QUERY_LARGE = `(min-width: ${1024 / BROWSER_DEFAULT_FONT_SIZE}em)`;
export const MEDIA_QUERY_XLARGE = `(min-width: ${1440 / BROWSER_DEFAULT_FONT_SIZE}em)`;

/**
 * @desc メディアクエリがロードで判定またはリサイズで判定が切り替わったときに、コールバックで真偽値を返します。
 * @link https://github.com/yuheiy/real-world-website-boilerplate/blob/master/src/js/mediaQuery.js
 * @param {string} mediaQuery - メディアクエリ文字列
 * @param {boolean} layoutChangedCallback - メディアクエリ文字列が一致するかの真偽値
 * @example
 * import { installMediaQueryWatcher, MEDIA_QUERY_MEDIUM } from './mediaQuery';
 * installMediaQueryWatcher(MEDIA_QUERY_MEDIUM, matches => {
 *   console.log(matches ? 'MEDIA_QUERY_MEDIUM' : 'MEDIA_QUERY_SMALL');
 * });
 */
export const installMediaQueryWatcher = (mediaQuery, layoutChangedCallback) => {
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
};
