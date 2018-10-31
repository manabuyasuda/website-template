/**
 * ハッシュ付きのリンクをスムーススクロールで移動します。
 * https://github.com/tsuyoshiwada/sweet-scroll
 *
 * 例1：id属性が指定してある要素に移動する（id属性値は数値から始めてはいけない）。
 * <a class="js-SmoothScroll" href="#section1">section1へ移動</a>
 * <div id="section1">○○</div>
 *
 * 例2：ページ読み込み時にハッシュと同じid属性があれば、その要素に移動する。
 * <a href="/foo/#section1">/foo/のsection1へ移動</a>
 * <div id="section1">○○</div>
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
    trigger: baseNameAttr, // Selector for trigger (must be a valid css selector)
    header: headerElement, // Selector or Element for fixed header (Selector of must be a valid css selector)
    duration: 1000, // Specifies animation duration in integer
    easing: 'easeOutQuint', // Specifies the pattern of easing
    offset: 0, // Specifies the value to offset the scroll position in pixels
    vertical: true, // Enable the vertical scroll
    horizontal: false, // Enable the horizontal scroll
    cancellable: true, // When fired wheel or touchstart events to stop scrolling
    updateURL: true, // Update the URL hash on after scroll (true | false | 'push' | 'replace')
    preventDefault: true, // Cancels the container element click event
    stopPropagation: true, // Prevents further propagation of the container element click event in the bubbling phase
    quickMode: false, // Instantly scroll to the destination! (It's recommended to use it with `easeOutExpo`)
  });

  /**
   * ページ読み込み時にURLのハッシュと同じid属性があれば、その要素まで移動する。
   */
  const locationHash = window.location.hash;
  const hashExists = locationHash.length >= 1;

  if (hashExists) {
    window.location.hash = '';
  }

  window.addEventListener(
    'DOMContentLoaded',
    () => {
      const needsInitialScroll = document.getElementById(locationHash.substr(1)) != null;

      if (needsInitialScroll) {
        scroller.to(locationHash, { updateURL: 'replace' });
      }
    },
    false,
  );
}
