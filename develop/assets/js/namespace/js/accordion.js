$(function() {

  /**
   * ベーシックなアコーディオンです。
   * キーボード操作（enterキーとスペースキー）とスクリーンリーダーに対応しています。
   * JS:
   * $('.js-accordion').accordion({
   *   'tab': '.js-accordion-tab',
   *   'tabpanel': '.js-accordion-panel',
   *   'useRole': false,
   *   'openFirstChild': true,
   *   'multiselectable': true,
   *   'tabClass': 'is-active',
   *   'panelClass': 'is-active'
   * });
   *
   * HTML:
   * <dl class="js-accordion">
   *   <dt>
   *     <button class="js-accordion-tab" type="button">アコーディオン1-1</button>
   *   </dt>
   *   <dd class="js-accordion-panel">
   *     <p>パネル1-1</p>
   *   </dd>
   *   <dt>
   *     <button class="js-accordion-tab" type="button">アコーディオン1-2</button>
   *   </dt>
   *   <dd class="js-accordion-panel">
   *     <p>パネル1-2</p>
   *   </dd>
   * </dl>
   */
  if($('.js-accordion').length) {
    $('.js-accordion').accordion({
      'tab': '.js-accordion-tab',
      'tabpanel': '.js-accordion-panel',
      'useRole': false,
      'openFirstChild': true,
      'multiselectable': true
    });
  }

}());
