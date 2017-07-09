;(function($) {

  'use strict';

  /**
   * @fileOverview キーボード操作やWAI-ARIAに対応したタブです。
   * `ul > li > a`、コンテンツは`<div>`などでマークアップすることを想定しています。
   * role属性とaria-*属性、tabindex属性はJS側で自動的に付与されます。
   * @see https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-2/tabs.html
   * @author Manabu Yasuda
   * @param {jQuery object} list ['.js-tabs-list'] - tablistに指定するクラス属性値。
   * @param {jQuery object} items ['.js-tabs-item'] - `li`に指定するクラス属性値。
   * @param {jQuery object} links ['.js-tabs-link'] - tabに指定するクラス属性値。
   * @param {jQuery object} contents ['.js-tabs-content'] - tabpanelに指定するクラス属性値。
   * @param {String || null} tabClass ['is-active'] - アクティブなタブに指定するクラス属性値。
   * @param {String || null} panelClass ['is-active'] - アクティブなタブパネルに指定するクラス属性値。
   * @param {boolean} useHash [true] - URLにハッシュを付与する場合は`true`。
   * @example
   * JS：
   * $('.js-tabs').tabs({
   *   'list': '.js-tabs-list',
   *   'items': '.js-tabs-item',
   *   'links': '.js-tabs-link',
   *   'contents': '.js-tabs-content',
   *   'tabClass': 'is-active',
   *   'panelClass': 'is-active',
   *   'useHash': true
   * });
   *
   * HTML：
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
  $.fn.tabs = function(options) {

    var defaults = {
      'list': '.js-tabs-list',
      'items': '.js-tabs-item',
      'links': '.js-tabs-link',
      'contents': '.js-tabs-content',
      'tabClass': 'is-active',
      'panelClass': 'is-active',
      'useHash': true
    };
    var settings = $.extend(defaults, options);

    return this.each(function(i) {
      var $this = $(this);

      /**
       * 初期設定：
       * 複数のタブがページ内にあることを想定して、一意なIDを付与する。
       */
      var tabId = i + 1;
      while($('#tabs' + tabId + '-1').length) {
        tabId++;
      }

      /**
       * 初期設定：
       * オプションを変数化する。
       */
      var $list = $this.find(settings['list']);
      var $items = $this.find(settings['items']);
      var $links = $this.find(settings['links']);
      var $contents = $this.find(settings['contents']);
      var tabClass = settings['tabClass'];
      var panelClass = settings['panelClass'];
      var useHash = settings['useHash'];

      /**
       * 初期設定：
       * 各要素にrole属性を付与する。
       */
      $list.attr('role', 'tablist');
      $items.attr('role', 'presentation');
      $links.attr('role', 'tab');
      $contents.attr('role', 'tabpanel');

      /**
       * 初期設定：
       * タブをすべて非表示にする。
       */
       function hideTab() {
        $links.attr({
          'tabindex': '-1',
          'aria-selected': 'false',
          'aria-expanded': 'false'
        });
        $items.removeClass(tabClass);
        $contents.attr('aria-hidden', 'true').removeClass(panelClass);
       }
       hideTab();

      /**
       * 初期設定：
       * `href`属性があるとSafariでフォーカスが正常に動作しないため削除する。
       */
       $links.removeAttr('href');

      /**
       * 初期設定：
       * 各要素を紐付けるためのIDを付与する。
       */
      $links.each(function(i) {
        var index = i + 1;
        $(this).attr({
          'id': 'tabs' + tabId + '-' + index,
          'aria-controls': 'tabs-panel' + tabId + '-' + index
        });
      });
      $contents.each(function(i) {
        var index = i + 1;
        $(this).attr({
          'aria-labelledby': 'tabs' + tabId + '-' + index,
          'id': 'tabs-panel' + tabId + '-' + index
        });
      });

      /**
       * 初期設定：
       * 最初のタブを表示させる。
       */
      $links.eq(0).attr({
        'tabindex': '0',
        'aria-selected': 'true',
        'aria-expanded': 'true'
      }).parent(settings['items']).addClass(tabClass);
      $contents.eq(0).attr('aria-hidden', 'false').addClass(panelClass);

      /**
       * 初期設定：
       * オプションのハッシュの付与が有効かつ、該当する要素がある場合は、ハッシュと一致するタブを表示する。
       */
      if(useHash) {
        var hash = window.location.hash.replace('#' , '');
        $links.each(function() {
          if(hash === $(this).attr('aria-controls')) {
            hideTab();
            $(this).attr({
              'tabindex': '0',
              'aria-selected': 'true',
              'aria-expanded': 'true'
            }).parent(settings['items']).addClass(tabClass);
            $contents.each(function() {
              if(hash === $(this).attr('id')) {
                $(this).attr({
                  'aria-hidden': 'false'
                }).addClass(panelClass);;
              }
            });
          }
        });
      }

      /**
       * タブがクリック・タップされたら、該当のタブを表示する。
       */
      $links.on('click', function(e) {
        var $thisLink = $(this);
        var controls = $thisLink.attr('aria-controls');
        hideTab();
        // クリックされたタブと紐づけられたコンテンツを表示する。
        $thisLink.attr({
          'tabindex': '0',
          'aria-selected': 'true',
          'aria-expanded': 'true'
        }).parent(settings['items']).addClass(tabClass);
        $contents.each(function() {
          if($(this).attr('id') === controls) {
            $(this).attr({
              'aria-hidden': 'false'
            }).addClass(panelClass);
          }
        });

        /**
         * オプションでハッシュの付与がtrueの場合は、URLにハッシュを付与する。
         */
        if(useHash) {
          var hash = $thisLink.attr('aria-controls');
          location.hash = hash;
        }

        e.preventDefault();
      });

      /**
       * キーボード操作。
       * 左右の矢印キーでフォーカスを動かす。左で戻り、右で進む。
       * フォーカスは行き止まりにならず、ループする。
       * enterかスペースキーを押したときにタブパネルが切り替わる。
       */
      $links.on('keydown', function(e) {
        var index = $links.index(this);
        if(e.which == 37){
          index--;
        } else if(e.which == 39){
          index++;
          // 最後のタブまで来たら最初のタブに戻る。
          if(index === $links.length) {
            index = 0;
          }
        }
        // 左右の矢印キー。
        if(e.which == 37 || e.which == 39) {
          $links.get(index).focus();
        }
        // enterかスペースキー。
        if(e.which === 13 || e.which === 32) {
          $(this).click();
          $(this).focus();
          e.preventDefault();
        }
      });

    });
  };
})(jQuery);
