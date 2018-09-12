/**
 * ページ内リンクをスムーススクロールで移動します。
 * `<body>`タグに`height: 100%;`、または`overflow: hidden`が指定されている場合は正常に動作しません。
 * https://github.com/cferdinandi/smooth-scroll
 * 例：ページトップへ戻る
 * <a class="js-smoothScroll" href="#">トップに戻る</a>
 *
 * 例：id属性が指定してある要素まで移動する
 * <header class="sw-Header"></header>
 * <a class="js-smoothScroll" href="#section1">○○へ移動</a>
 * <div id="section1">○○</div>
 */
import SmoothScroll from 'smooth-scroll';
export default function jsSmoothScroll() {
  let scroll = new SmoothScroll('.js-smoothScroll', {

    // Selectors
    ignore: '.js-smoothScroll-ignore', // Selector for links to ignore (must be a valid CSS selector)
    header: null, // Selector for fixed headers (must be a valid CSS selector)
    topOnEmptyHash: true, // Scroll to the top of the page for links with href="#"

    // Speed & Easing
    speed: 500, // Integer. How fast to complete the scroll in milliseconds
    clip: true, // If true, adjust scroll distance to prevent abrupt stops near the bottom of the page
    easing: 'easeInOutCubic', // Easing pattern to use

    // History
    updateURL: true, // Update the URL on scroll
    popstate: true, // Animate scrolling with the forward/backward browser buttons (requires updateURL to be true)

  });
};
