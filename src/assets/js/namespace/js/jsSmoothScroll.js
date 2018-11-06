/**
 * ハッシュ付きのリンクをスムーススクロールで移動します。
 * ページ読み込み時にハッシュと同じid属性があれば、その要素に移動します。
 * https://github.com/tsuyoshiwada/sweet-scroll
 */
import SweetScroll from 'sweet-scroll';

export default function jsSmoothScroll() {
  // クラスで指定する場合。
  // const baseNameClass = 'js-SmoothScroll';
  // ハッシュ付きリンクに指定する場合。
  const baseNameAttr = 'a[href*="#"]:not([href*="/"]):not(#st-BackToTop)';
  // 固定ヘッダーのCSSセレクタ。
  const headerElement = '[data-scroll-header]';

  const scroller = new SweetScroll({
    trigger: baseNameAttr, // トリガーとなる要素をCSSセレクタで指定
    header: headerElement, // 固定ヘッダをCSSセレクタで指定
    duration: 1000, // アニメーション再生時間のミリ秒
    easing: 'easeOutQuint', // イージングのタイプ
    offset: 0, // スクロール位置のオフセット
    vertical: true, // 垂直方向のスクロールを許可する
    horizontal: false, // 水平方向のスクロールを許可する
    cancellable: true, // ホイールやタッチイベント発生時にスクロールを停止する
    updateURL: true, // スクロール完了後にURLを更新する
    preventDefault: true, // コンテナ要素のクリックイベントを防止する
    stopPropagation: true, // コンテナ要素のバブリングを防止する
    quickMode: false, // 目的地まで素早く移動する (`easeOutExpo`を推奨)
  });

  /**
   * ページ読み込み時にURLのハッシュと同じid属性があれば、その要素まで移動する。
   */
  const locationHash = window.location.hash;
  const hashExists = locationHash.length >= 1;

  if (hashExists) {
    window.location.hash = '';
  }

  window.addEventListener('DOMContentLoaded', () => {
    const scrollElement = document.getElementById(locationHash.substr(1));
    const needsInitialScroll = scrollElement != null;

    if (needsInitialScroll) {
      scroller.to(locationHash, { updateURL: 'replace' });
    }
  });
}
