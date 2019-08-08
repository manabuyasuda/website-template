const query = {
  search: 'q',
  page: 'page',
};
let list = {};

/**
 * History APIでブラウザ履歴を変更します。
 * @example
 * import History from './domain/History';
 */
export default class History {
  constructor() {
    this.fetch();
  }

  /**
   * クエリのキーを返します。
   * @return {Object} query
   * @example
   * const { query } = History;
   */
  static get query() {
    return query;
  }

  /**
   * クエリの値を返します。
   * @return {Object} list
   * @example
   * const historyList = History.list;
   */
  static get list() {
    return list;
  }

  /**
   * パラメーターを取得して上書きします。
   * @example
   * History.fetch();
   */
  static fetch() {
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

    list = targetParameter;

    return this;
  }

  /**
   * `pushState()`で履歴を追加します。
   * @example
   * History.push();
   */
  static push() {
    const parameter = Object.keys(list).map(key => {
      const value = list[key];
      return `${key}=${value}`;
    });

    const firstQuery = parameter.length ? '?' : window.location.pathname;

    window.history.pushState(
      `${firstQuery}${parameter.join('&')}`,
      '',
      `${firstQuery}${parameter.join('&')}`,
    );

    return this;
  }

  /**
   * `replaceState()`で履歴を修正します。
   * @example
   * History.replace();
   */
  static replace() {
    const parameter = Object.keys(list).map(key => {
      const value = list[key];
      return `${key}=${value}`;
    });

    window.history.replaceState(`?${parameter.join('&')}`, '', `?${parameter.join('&')}`);
    return this;
  }

  /**
   * パラメーターを統合します。追加や上書きする場合に使用します。
   * @param {Object} parameter - 結合したいパラメーターのオブジェクト
   * @example
   * const { searchQuery } = History;
   * History.marge({ [query.page]: '2' });
   * History.marge({ [query.page]: '1', [query.search]: '検索キーワード' });
   */
  static marge(parameter) {
    list = Object.assign(list, parameter);
    return this;
  }

  /**
   * パラメーターからプロパティを削除します。
   * @param {String} key - 削除するプロパティのキー
   * @example
   * const { query } = History;
   * History.remove(query.page);
   */
  static remove(removeKey) {
    const parameter = Object.keys(list).reduce((results, key) => {
      const result = results;

      if (removeKey !== key) {
        result[key] = list[key];
      }

      return result;
    }, {});

    list = parameter;
    return this;
  }

  /**
   * パラメーターをすべてリセットします。
   * @example
   * History.clear();
   */
  static clear() {
    list = {};
    return this;
  }
}
