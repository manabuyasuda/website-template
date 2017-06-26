(function($) {

  /**
   * キーボード操作にも対応したタブです。
   * タブのアンカーは`ul > li > a`、コンテンツは`<div>`などでマークアップすることを想定しています。
   * role属性とaria=*属性、tabindex属性はJS側で自動的に付与されます。
   * 'addClass'を指定するとアクティブな`item`にクラスが付与されます。
   * 'addHash'をtrueにするとタブ切り替え時にURLにハッシュが付与され、リロード時にハッシュと一致するタブが表示されます。
   * JS：
   * $('.js-tabs').tabs({
   *   'list': '.js-tabs-list',
   *   'item': '.js-tabs-item',
   *   'link': '.js-tabs-link',
   *   'content': '.js-tabs-content',
   *   'addClass': 'is-active',
   *   'addHash': true
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

    // オプション（初期値）
    var defaults = {
      'list': '.js-tabs-list', // ul
      'item': '.js-tabs-item', // li
      'link': '.js-tabs-link', // a
      'content': '.js-tabs-content', // div
      'addClass': 'is-active', // アクティブなタブにクラス属性を付与する。
      'addHash': true // ハッシュをURLに付与する。
    };
    var settings = $.extend(defaults, options);

    return this.each(function(i) {
      var $this = $(this);
      // 複数のタブがページ内にあることを想定して、一意なIDを付与する。
      var tabId = i + 1;

      /**
       * オプション（初期値）。
       */
      var $list = $this.find(settings['list']);
      var $item = $this.find(settings['item']);
      var $link = $this.find(settings['link']);
      var $content = $this.find(settings['content']);
      var addClass = settings['addClass'];
      var addHash = settings['addHash'];

      /**
       * 初期設定：
       * 各要素にrole属性を付与する。
       */
      $list.attr('role', 'tablist');
      $item.attr('role', 'presentation');
      $link.attr('role', 'tab');
      $content.attr('role', 'tabpanel');

      /**
       * 初期設定：
       * タブをすべて非表示にする。
       */
       function hideTab() {
        $link.attr({
          'tabindex': '-1',
          'aria-selected': 'false',
          'aria-expanded': 'false'
        });
        $item.removeClass(addClass);
        $content.attr('aria-hidden', 'true');
       }
       hideTab();

      /**
       * 初期設定：
       * タブのコンテンツ内にアクセスできるようにする。
       */
       $content.each(function() {
        $(this).children().eq(0).attr('tabindex', '0').css('outline', 'none');
       });

      /**
       * 初期設定：
       * `href`属性があるとSafariでフォーカスが正常に動作しないため削除する。
       */
       $link.removeAttr('href');

      /**
       * 初期設定：
       * 各要素を紐付けるためのIDを付与する。
       */
      $link.each(function(i) {
        var index = i + 1;
        $(this).attr({
          'id': 'tab' + tabId + '-' + index,
          'aria-controls': 'tabpanel' + tabId + '-' + index
        });
      });
      $content.each(function(i) {
        var index = i + 1;
        $(this).attr({
          'aria-labelledby': 'tab' + tabId + '-' + index,
          'id': 'tabpanel' + tabId + '-' + index
        });
      });

      /**
       * 初期設定：
       * 最初のタブを表示させる。
       */
      $link.eq(0).attr({
        'tabindex': '0',
        'aria-selected': 'true',
        'aria-expanded': 'true'
      }).parent(settings['item']).addClass(addClass);
      $content.eq(0).attr('aria-hidden', 'false');

      /**
       * 初期設定：
       * オプションのハッシュの付与が有効かつ、該当する要素がある場合は、ハッシュと一致するタブを表示する。
       */
      if(addHash) {
        var hasId = false;
        var hash = window.location.hash.replace('#' , '');
        $link.each(function() {
          if(hash === $(this).attr('aria-controls')) {
            hideTab();
            $(this).attr({
              'tabindex': '0',
              'aria-selected': 'true',
              'aria-expanded': 'true'
            }).parent(settings['item']).addClass(addClass);
            $content.each(function() {
              if(hash === $(this).attr('id')) {
                $(this).attr({
                  'aria-hidden': 'false'
                });
              }
            });
          }
        });
      }

      /**
       * タブがクリック・タップされたら、該当のタブを表示する。
       */
      $link.on('click', function(e) {
        var $thisLink = $(this);
        var controls = $thisLink.attr('aria-controls');
        hideTab();
        // クリックされたタブと紐づけられたコンテンツを表示する。
        $thisLink.attr({
          'tabindex': '0',
          'aria-selected': 'true',
          'aria-expanded': 'true'
        }).parent(settings['item']).addClass(addClass);
        $content.each(function() {
          if($(this).attr('id') === controls) {
            $(this).attr({
              'aria-hidden': 'false'
            });
          }
        });

        /**
         * オプションでハッシュの付与がtrueの場合は、URLにハッシュを付与する。
         */
        if(addHash) {
          var hash = $thisLink.attr('aria-controls');
          location.hash = hash;
        }

        e.preventDefault();
      });

      /**
       * 矢印キーで操作されたときの処理。
       * 上と左で戻り、右と下で進む。
       * フォーカスは行き止まりにならず、ループする。
       */
      $link.on('keydown', function(e) {
        var index = $link.index(this);
        if(e.keyCode == 37 || e.keyCode == 38){
          index--;
        } else if(e.keyCode == 40 || e.keyCode == 39){
          index++;
          // 最後のタブまで来たら最初のタブに戻る。
          if(index === $link.length) {
            index = 0;
          }
        }
        if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 39) {
          $link.get(index).click();
          $link.get(index).focus();
        }
      });

    });
  };
})(jQuery);
