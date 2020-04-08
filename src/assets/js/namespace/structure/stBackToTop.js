/**
 * ページ上部にスムーススクロールで移動します。
 * https://github.com/tsuyoshiwada/sweet-scroll
 */
import SweetScroll from 'sweet-scroll';

export default function stBackToTop() {
  // IDで指定する場合。
  const baseName = '#st-BackToTop';
  // 固定ヘッダーのCSSセレクタ。
  const headerElement = '[data-scroll-header]';

  const backToTop = new SweetScroll({ // eslint-disable-line
    trigger: baseName, // トリガーとなる要素をCSSセレクタで指定
    header: headerElement, // 固定ヘッダをCSSセレクタで指定
    duration: 1000, // アニメーション再生時間のミリ秒
    easing: 'easeOutQuint', // イージングのタイプ
    offset: 0, // スクロール位置のオフセット
    vertical: true, // 垂直方向のスクロールを許可する
    horizontal: false, // 水平方向のスクロールを許可する
    cancellable: true, // ホイールやタッチイベント発生時にスクロールを停止する
    updateURL: false, // スクロール完了後にURLを更新する
    preventDefault: true, // コンテナ要素のクリックイベントを防止する
    stopPropagation: true, // コンテナ要素のバブリングを防止する
    after() {
      const destination = document.getElementsByTagName('body')[0];
      destination.setAttribute('tabindex', '-1');
      destination.focus();
    },
  });
}
