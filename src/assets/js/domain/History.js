/**
 * History APIでブラウザ履歴を変更します。
 * @example
 * import History from './History';
 * const history = new History();
 */
export default class History {
  constructor() {
    /**
     * @property {string} query - 検索キーワードのキー
     * @property {object} parameter - パラメーターの一時保存オブジェクト
     */
    this.query = 'q';
    this.parameter = {};

    this.fetch();
  }

  /**
   * パラメーターを取得して上書きします。
   * @example
   * history.fetch();
   */
  fetch() {
    const locationSearch = window.location.search.substring(1);
    const hasParamter = !!locationSearch.length;

    if (!hasParamter) return {};

    const targetParameter = locationSearch.split('&').reduce((result, parameter) => {
      const obj = result;
      const keyValue = parameter.split('=');
      const key = keyValue[0];
      const value = keyValue[1];

      obj[key] = decodeURI(value);
      return obj;
    }, {});

    this.parameter = targetParameter;

    return this;
  }

  /**
   * `pushState()`で履歴を追加します。
   * @example
   * history.push();
   */
  push() {
    const parameter = Object.keys(this.parameter).map(key => {
      const value = this.parameter[key];
      return `${key}=${value}`;
    });

    const query = parameter.length ? '?' : window.location.pathname;

    window.history.pushState(
      `${query}${parameter.join('&')}`,
      '',
      `${query}${parameter.join('&')}`,
    );

    return this;
  }

  /**
   * `replaceState()`で履歴を修正します。
   * @example
   * history.replace();
   */
  replace() {
    const parameter = Object.keys(this.parameter).map(key => {
      const value = this.parameter[key];
      return `${key}=${value}`;
    });

    window.history.replaceState(`?${parameter.join('&')}`, '', `?${parameter.join('&')}`);
    return this;
  }

  /**
   * パラメーターを統合します。追加や上書きする場合に使用します。
   * @param {Object} parameter - 結合したいパラメーターのオブジェクト
   * @example
   * history.marge({ page: '2' });
   * history.marge({ page: '1', q: '検索キーワード' });
   */
  marge(parameter) {
    this.parameter = Object.assign(this.parameter, parameter);
    return this;
  }

  /**
   * パラメーターからプロパティを削除します。
   * @param {String} key - 削除するプロパティのキー
   * @example
   * history.remove('foo');
   */
  remove(removeKey) {
    const parameter = Object.keys(this.parameter).reduce((results, key) => {
      const result = results;

      if (removeKey !== key) {
        result[key] = this.parameter[key];
      }

      return result;
    }, {});

    this.parameter = parameter;
    return this;
  }

  /**
   * パラメーターをすべてリセットします。
   * @example
   * history.clear();
   */
  clear() {
    this.parameter = {};
    return this;
  }
}
