;(function($) {

  'use strict';

  /**
   * @fileOverview キーボード操作やWAI-ARIAに対応したアコーディオンです。
   * role属性とaria-*属性、tabindex属性はJS側で自動的に付与されます。
   * @author Manabu Yasuda
   * @param {jQuery object} tabs ['.js-accordion-tab'] - アンカーに指定するクラス属性値。
   * @param {jQuery object} tabpanels ['.js-accordion-panel'] - tabpanelに指定するクラス属性値。
   * @param {boolean} useRole [false] - role属性を付与する場合は`true`
   * @param {boolean} openFirstChild [true] - デフォルトで最初の要素を開く場合は`true`
   * @param {boolean} multiselectable [true] - 同時に複数の要素を開く場合は`true`
   * @param {String || null} tabClass ['is-active'] - アクティブなアンカーに指定するクラス属性値。
   * @param {String || null} panelClass ['is-active'] - アクティブなtabpanelに指定するクラス属性値。
   * @example
   * JS:
   * $('.js-accordion').accordion({
   *   'tabs': '.js-accordion-tab',
   *   'tabpanels': '.js-accordion-panel',
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
  $.fn.accordion = function(options) {

    var defaults = {
      'tabs': '.js-accordion-tab',
      'tabpanels': '.js-accordion-panel',
      'useRole': false,
      'openFirstChild': true,
      'multiselectable': true,
      'tabClass': 'is-active',
      'panelClass': 'is-active'
    };
    var settings = $.extend(defaults, options);

    return this.each(function(i) {
      var $this = $(this);
      // 複数のタブがページ内にあることを想定して、一意なIDを付与する。
      var tabId = i + 1;

      /**
       * 初期設定：
       * オプションを変数化する。
       */
      var $tablist = $this;
      var $tabs = $tablist.find(settings['tab']);
      var $tabpanels = $tablist.find(settings['tabpanel']);
      var useRole = settings['useRole'];
      var openFirstChild = settings['openFirstChild'];
      var multiselectable = settings['multiselectable'];
      var tabClass = settings['tabClass'];
      var panelClass = settings['panelClass'];

      /**
       * 初期設定：
       * 各要素にrole属性を付与する。
       */
      if(useRole) {
        $tablist.attr('role', 'tablist');
        $tabs.attr('role', 'tab');
        $tabpanels.attr('role', 'tabpanel');
      }

      /**
       * 初期設定：
       * 複数のtabpanelを開く場合はaria-multiselectable属性を付与する。
       */
      if(multiselectable) {
        $tablist.attr('aria-multiselectable', 'true');
      }

      /**
       * 初期設定：
       * `$tabs`をフォーカス可能にする。
       * `$tabpanels`内の最初の要素をフォーカス可能にする。
       */
      $tabs.attr('tabindex', '0');
      $tabpanels.each(function() {
        $(this).children().eq(0).attr('tabindex', '0').css('outline', 'none');
      });

      /**
       * 初期設定：
       * 各要素を紐付けるためのIDを付与する。
       */
      $tabs.each(function(i) {
        var index = i + 1;
        $(this).attr({
          'id': 'accordion' + tabId + '-' + index,
          'aria-controls': 'accordion-panel' + tabId + '-' + index
        });
      });
      $tabpanels.each(function(i) {
        var index = i + 1;
        $(this).attr({
          'aria-labelledby': 'accordion' + tabId + '-' + index,
          'id': 'accordion-panel' + tabId + '-' + index
        });
      });

      /**
       * 初期設定：
       * タブをすべて非表示にする。
       */
       function hideTab() {
        $tabs.attr('aria-expanded', 'false').removeClass(tabClass);
        $tabpanels.attr('aria-hidden', 'true').removeClass(panelClass);
       }
       hideTab();

      /**
       * 初期設定：
       * 最初のタブを表示させる。
       */
      if(openFirstChild) {
        $tabs.eq(0).attr('aria-expanded', 'true').addClass(tabClass);
        $tabpanels.eq(0).attr('aria-hidden', 'false').addClass(panelClass);
      }

      /**
       * タブがクリック・タップされたら、該当するタブを表示する。
       */
      $tabs.on('click', function(e) {
        var $thisTab = $(this);
        var controls = $thisTab.attr('aria-controls');

        // 閉じているタブをクリックした場合
        if($thisTab.attr('aria-expanded') === 'false') {
          if(!multiselectable) {
            hideTab();
          }
          $thisTab.attr('aria-expanded', 'true').addClass(tabClass);
          $tabpanels.each(function() {
            if($(this).attr('id') === controls) {
              $(this).attr('aria-hidden', 'false').addClass(panelClass);
            }
          });
        } else {
          // 開いているタブをクリックした場合
          if(!multiselectable) {
            hideTab();
          }
          $thisTab.attr('aria-expanded', 'false').removeClass(tabClass);
          $tabpanels.each(function() {
            if($(this).attr('id') === controls) {
              $(this).attr('aria-hidden', 'true').removeClass(panelClass);
            }
          });
        }

        e.preventDefault();
      });

      /**
       * enterかスペースを押したときも、クリックイベントと同様の処理をする。
       */
      $tabs.on('keydown', function(e) {
        if(e.which === 13 || e.which === 32) {
          $(this).click();
          $(this).focus();
          e.preventDefault();
        }
      });

    });
  };
})(jQuery);
