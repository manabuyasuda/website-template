$(function() {

  /**
   * ページ内リンクをスムーススクロールで移動します。
   * https://cferdinandi.github.io/smooth-scroll/options.html
   * 例：ページトップへ戻る
   * <a class="js-smoothScroll" href="#">トップに戻る</a>
   *
   * 例：id属性が指定してある要素まで移動する
   * <a class="js-smoothScroll" href="#section1">○○へ移動</a>
   * <div id="section1">○○</div>
   */
  smoothScroll.init({
    selector: '.js-smoothScroll', // スムーススクロールが有効なリンクに付ける属性
    selectorHeader: null, // 固定ナビに付ける属性（例：`sw-Header`）
    speed: 500, // 到達するまでの総時間(ミリ秒)
    easing: 'easeInOutCubic', // イージングの種類
    offset: 0, // 到達場所からズラすピクセル数
    updateURL: false, // 実行後のURLの末尾に`#`をつけるか
  });

}());
