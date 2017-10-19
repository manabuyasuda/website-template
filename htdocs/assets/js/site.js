$(function() {

  /**
   * 同じ行にある要素の高さを揃えます。
   * https://github.com/liabru/jquery-match-height#options
   * 例：
   * <div class="parent">
   *   <div class="child js-alignHeight"></div>
   *   <div class="child js-alignHeight"></div>
   * </div>
   */
  if($('.js-alignHeight').length) {
    $('.js-alignHeight').matchHeight();
  }

}());

$(function() {

  /**
   * スマホで閲覧している場合にだけ電話番号にリンクを貼ります。
   * 要素内の文字列からハイフンとスペースなどの空白文字を削除してリンクに設定します。
   * 例：
   * <p>
   *   <span class="js-changeTelLink"> +0120-123-456</span>
   * </p>
   *
   * 処理後：
   * <p>
   *   <span class="js-changeTelLink"><a href="tel:+0120123456"> +0120-123-456</a></span>
   * </p>
   */
  var ua = navigator.userAgent.toLowerCase();
  var isiPhone = (ua.indexOf('iphone') > -1) && (ua.indexOf('ipad') == -1);
  var isAndroid = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') > -1);
  var isSP = (isiPhone || isAndroid);

  if(isSP && $('.js-changeTelLink').length) {
    $('.js-changeTelLink').each(function(){
      var $this = $(this);
      var str = $this.text();
      $this.html($('<a>').attr({
        href: 'tel:' + str.replace(/[\-\s]/g, ''),
        class: null // リンクに付与するクラス（例：'sw-LinkTel'）
      }).append(str + '</a>'));
    });
  }

}());

$(function() {

  /**
   * ページ内リンクをスムーススクロールで移動します。
   * `<body>`タグに`height: 100%;`、または`overflow: hidden`が指定されている場合は正常に動作しません。
   * https://cferdinandi.github.io/smooth-scroll/options.html
   * 例：ページトップへ戻る
   * <a class="js-smoothScroll" href="#">トップに戻る</a>
   *
   * 例：id属性が指定してある要素まで移動する
   * <header class="sw-Header"></header>
   * <a class="js-smoothScroll" href="#section1">○○へ移動</a>
   * <div id="section1">○○</div>
   */
  if($('.js-smoothScroll').length) {
    smoothScroll.init({
      selector: '.js-smoothScroll', // スムーススクロールが有効なリンクに付ける属性
      ignore: '.js-smoothScroll-ignore', // スムーススクロールを無効にするリンクに付ける属性
      selectorHeader: null, // 固定ヘッダーに指定しているJQueryのセレクタ（例：`.sw-Header`）、複数ある場合はHTML上で最後に記述した要素を指定する
      speed: 500, // 到達するまでの総時間(ミリ秒)
      easing: 'easeInOutCubic', // イージングの種類
      offset: 0 // 到達場所からズラすピクセル数
    });
  }

}());

//# sourceMappingURL=site.js.map
