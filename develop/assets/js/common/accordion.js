(function($) {

  /**
   * キーボード操作にも対応したアコーディオンです。
   * 定義リストのように、role属性で上書きすることが適切でない場合は、`useRole`を`false`にしてください。
   * `openFirstChild`を`true`にすると、ロード時に最初の要素が開いた状態になります。
   * `multiselectable`をtrueにすると、複数の要素を同時に開くことができます。
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
  $.fn.accordion = function(options) {

    // オプション（初期値）
    var defaults = {
      'tab': '.js-accordion-tab',
      'tabpanel': '.js-accordion-panel',
      'useRole': false, // role属性を使用する。
      'openFirstChild': true, // ロード時に最初の要素を表示する。
      'multiselectable': true, // 複数のtabpanelを開く。
      'tabClass': 'is-active', // アクティブなタブにクラス属性を付与する。
      'panelClass': 'is-active' // アクティブなタブパネルにクラス属性を付与する。
    };
    var settings = $.extend(defaults, options);

    return this.each(function(i) {
      var $this = $(this);
      // 複数のタブがページ内にあることを想定して、一意なIDを付与する。
      var tabId = i + 1;

      /**
       * オプション（初期値）。
       */
      var $tablist = $this;
      var $tab = $tablist.find(settings['tab']);
      var $tabpanel = $tablist.find(settings['tabpanel']);
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
        $tab.attr('role', 'tab');
        $tabpanel.attr('role', 'tabpanel');
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
       * `$tab`をフォーカス可能にする。
       * `$tabpanel`内の最初の要素をフォーカス可能にする。
       */
      $tab.attr('tabindex', '0');
      $tabpanel.each(function() {
        $(this).children().eq(0).attr('tabindex', '0').css('outline', 'none');
      });

      /**
       * 初期設定：
       * 各要素を紐付けるためのIDを付与する。
       */
      $tab.each(function(i) {
        var index = i + 1;
        $(this).attr({
          'id': 'accordion' + tabId + '-' + index,
          'aria-controls': 'accordion-panel' + tabId + '-' + index
        });
      });
      $tabpanel.each(function(i) {
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
        $tab.attr('aria-expanded', 'false').removeClass(tabClass);
        $tabpanel.attr('aria-hidden', 'true').removeClass(panelClass);
       }
       hideTab();

      /**
       * 初期設定：
       * 最初のタブを表示させる。
       */
      if(openFirstChild) {
        $tab.eq(0).attr('aria-expanded', 'true').addClass(tabClass);
        $tabpanel.eq(0).attr('aria-hidden', 'false').addClass(panelClass);
      }

      /**
       * タブがクリック・タップされたら、該当するタブを表示する。
       */
      $tab.on('click', function(e) {
        var $thisTab = $(this);
        var controls = $thisTab.attr('aria-controls');

        // 閉じているタブをクリックした場合
        if($thisTab.attr('aria-expanded') === 'false') {
          if(!multiselectable) {
            hideTab();
          }
          $thisTab.attr('aria-expanded', 'true').addClass(tabClass);
          $tabpanel.each(function() {
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
          $tabpanel.each(function() {
            if($(this).attr('id') === controls) {
              $(this).attr('aria-hidden', 'true').removeClass(panelClass);
            }
          });
        }

        e.preventDefault();
      });

      /**
       * enterかスペースを押したときの処理。
       */
      $tab.on('keydown', function(e) {
        if(e.which === 13 || e.which === 32) {
          $(this).click();
          $(this).focus();
          e.preventDefault();
        }
      });

    });
  };
})(jQuery);
