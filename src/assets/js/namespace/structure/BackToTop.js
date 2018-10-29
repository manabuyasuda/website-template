/**
 * ページ上部にスムーススクロールで移動します。
 * https://github.com/tsuyoshiwada/sweet-scroll
 *
 * 例：ページの上部に移動する。
 * <a id="st-BackToTop" href="#">TOPへ移動</a>
 */
import SweetScroll from "sweet-scroll"
export default function stBackToTop() {
  const Selector = {
    ID: '#st-BackToTop', // IDで指定する場合。
    HEADER: '[data-scroll-header]' // 固定ヘッダーのCSSセレクタ。
  };

  const backToTop = new SweetScroll({
    trigger: Selector.ID,       // Selector for trigger (must be a valid css selector)
    header: Selector.HEADER, // Selector or Element for fixed header (Selector of must be a valid css selector)
    duration: 1000,                 // Specifies animation duration in integer
    easing: 'easeOutQuint',         // Specifies the pattern of easing
    offset: 0,                      // Specifies the value to offset the scroll position in pixels
    vertical: true,                 // Enable the vertical scroll
    horizontal: false,              // Enable the horizontal scroll
    cancellable: true,              // When fired wheel or touchstart events to stop scrolling
    updateURL: false,               // Update the URL hash on after scroll (true | false | 'push' | 'replace')
    preventDefault: true,           // Cancels the container element click event
    stopPropagation: true,          // Prevents further propagation of the container element click event in the bubbling phase
    quickMode: false               // Instantly scroll to the destination! (It's recommended to use it with `easeOutExpo`)
  });
};
