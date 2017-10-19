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
