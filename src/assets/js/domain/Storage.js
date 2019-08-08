/**
 * ローカルストレージのキーを管理します。
 * @type {string}
 */
const KEY = 'APP';
/**
 * ローカルストレージの値をオブジェクトで管理します。
 * @type {object}
 */
let list = {};

/**
 * localStorageの取得と更新、統合と削除をします。
 * @example
 * import Storage from './domain/Storage';
 */
export default class Storage {
  constructor() {
    this.fetch();
    this.update();
  }

  /**
   * ローカルストレージの値を返します。
   * @return {Object} list
   * @example
   * const storageList = Storage.list;
   */
  static get list() {
    return list;
  }

  /**
   * ローカルストレージを取得します。
   */
  static fetch() {
    const item = JSON.parse(localStorage.getItem(KEY));
    const isNil = item === undefined || item === null;

    if (!isNil) {
      list = Object.assign(list, item);
    }

    return this;
  }

  /**
   * ローカルストレージを更新します。
   */
  static update() {
    localStorage.setItem(KEY, JSON.stringify(list));
    return this;
  }

  /**
   * ストレージオブジェクトを統合して、ローカルストレージを更新します。
   * @param {Object} storage - 統合するキーと値のオブジェクト
   * @example
   * Storage.marge({ foo: 'foo', bar: 'bar' });
   */
  static marge(storage) {
    list = Object.assign(list, storage);
    this.update();
    return this;
  }

  /**
   * オブジェクトからキーを削除して、ローカルストレージを更新します。
   * @param {String} key - 削除するキー
   * @example
   * Storage.remove('foo');
   */
  static remove(removeKey) {
    const storage = Object.keys(list).reduce((results, key) => {
      const result = results;

      if (removeKey !== key) {
        result[key] = list[key];
      }

      return result;
    }, {});

    list = storage;
    this.update();
    return this;
  }

  /**
   * ローカルストレージを空にします。
   */
  static clear() {
    list = {};
    this.update();
    return this;
  }

  /**
   * ローカルストレージが更新されたらコールバック関数を実行する。
   * @param {function} callback
   * @example
   * Storage.watch(watches => {
   *   console.log(watches.newValue);
   * });
   */
  static watch(callback) {
    window.addEventListener('storage', e => {
      const { key } = e;
      const matchKey = key === KEY;

      if (matchKey) {
        callback(e);
      }
    });
  }

  /**
   * ローカルストレージが使用できるか判定します。
   * @return 使用できるかの真偽値
   * @example
   * const isStorageAvailable = Storage.isAvailable();
   */
  static isAvailable() {
    const dummy = 'dummy';

    try {
      localStorage.setItem(dummy, dummy);
      localStorage.removeItem(dummy);

      return true;
    } catch (e) {
      return false;
    }
  }
}
