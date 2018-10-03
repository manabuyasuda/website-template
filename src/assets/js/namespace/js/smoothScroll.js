/**
 * ページ内リンクをスムーススクロールで移動します。
 * https://github.com/tsuyoshiwada/sweet-scroll
 *
 * 例：id属性が指定してある要素まで移動する
 * <a class="js-smoothScroll" href="#section1">section1へ移動</a>
 * <div id="section1">○○</div>
 */
import SweetScroll from "sweet-scroll"
export default function jsSmoothScroll() {
  const scroller = new SweetScroll({
    trigger: '.js-smoothScroll',       // Selector for trigger (must be a valid css selector)
    header: '[data-scroll-header]', // Selector or Element for fixed header (Selector of must be a valid css selector)
    duration: 1000,                 // Specifies animation duration in integer
    easing: 'easeOutQuint',         // Specifies the pattern of easing
    offset: 0,                      // Specifies the value to offset the scroll position in pixels
    vertical: true,                 // Enable the vertical scroll
    horizontal: false,              // Enable the horizontal scroll
    cancellable: true,              // When fired wheel or touchstart events to stop scrolling
    updateURL: true,               // Update the URL hash on after scroll (true | false | 'push' | 'replace')
    preventDefault: true,           // Cancels the container element click event
    stopPropagation: true,          // Prevents further propagation of the container element click event in the bubbling phase
    quickMode: true               // Instantly scroll to the destination! (It's recommended to use it with `easeOutExpo`)
  });

  /**
   * 別のページでハッシュ付きのURLで開いたときもアニメーションさせる。
   */
  const hash = window.location.hash;
  const needsInitialScroll = document.getElementById(hash.substr(1)) != null;

  if (needsInitialScroll) {
    window.location.hash = '';
  }

  window.addEventListener('load', () => {
    if (needsInitialScroll) {
      scroller.to(hash, {updateURL: 'replace'});
    }
  }, false);
};
