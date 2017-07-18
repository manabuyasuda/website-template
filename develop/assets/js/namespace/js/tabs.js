$(function() {

  /**
   * ベーシックなタブです。
   * キーボード操作（矢印キー）とスクリーンリーダーに対応しています。
   * アクティブなタブには`.is-active`が付きます。
   * 例：
   * <div class="js-tabs">
   *   <ul class="js-tabs-list">
   *    <li class="js-tabs-item"><a class="js-tabs-link">タブ1-1</a></li>
   *    <li class="js-tabs-item"><a class="js-tabs-link">タブ1-2</a></li>
   *  </ul>
   *  <div class="js-tabs-content">
   *    <p>コンテンツ1-1</p>
   *  </div>
   *  <div class="js-tabs-content">
   *    <p>コンテンツ1-2</p>
   *  </div>
   * </div>
   */
  if($('.js-tabs').length) {
    $('.js-tabs').tabs({
      'list': 'ul',
      'item': 'li',
      'link': 'a',
      'content': 'div',
      'addClass': 'is-active',
      'addHash': true
    });
  }

}());
