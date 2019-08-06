/**
 * localStorageの取得と更新、統合と削除をします。
 * @example
 * import Storage from './Storage';
 * const storage = new Storage();
 */
export default class Storage {
  constructor() {
    /**
     * @property {string} key - ローカルストレージのキー
     * @property {object} storage - ローカルストレージ値の一時保存オブジェクト
     */
    this.key = 'APP';
    this.storage = {};

    this.fetch();
    this.update();
  }

  /**
   * ローカルストレージを取得します。
   */
  fetch() {
    const item = JSON.parse(localStorage.getItem(this.key));
    const isNil = item === undefined || item === null;

    if (!isNil) {
      this.storage = Object.assign(this.storage, item);
    }

    return this;
  }

  /**
   * ローカルストレージを更新します。
   */
  update() {
    localStorage.setItem(this.key, JSON.stringify(this.storage));
    return this;
  }

  /**
   * ストレージオブジェクトを統合して、ローカルストレージを更新します。
   * @param {Object} storage - 統合するキーと値のオブジェクト
   * @example
   * storage.marge({ foo: 'foo', bar: 'bar' });
   */
  marge(storage) {
    this.storage = Object.assign(this.storage, storage);
    this.update();
    return this;
  }

  /**
   * オブジェクトからキーを削除して、ローカルストレージを更新します。
   * @param {String} key - 削除するキー
   * @example
   * storage.remove('foo');
   */
  remove(removeKey) {
    const storage = Object.keys(this.storage).reduce((results, key) => {
      const result = results;

      if (removeKey !== key) {
        result[key] = this.storage[key];
      }

      return result;
    }, {});

    this.storage = storage;
    this.update();
    return this;
  }

  /**
   * ローカルストレージを空にします。
   */
  clear() {
    this.storage = {};
    this.update();
    return this;
  }

  /**
   * ローカルストレージが更新されたらコールバック関数を実行する。
   * @param {function} callback
   * @example
   * storage.watch(watches => {
   *   console.log(watches.newValue);
   * });
   */
  watch(callback) {
    window.addEventListener('storage', e => {
      const { key } = e;
      const matchKey = key === this.key;

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
