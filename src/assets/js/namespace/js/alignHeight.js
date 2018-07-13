/**
 * 同じ行にある要素の高さを揃えます。
 * https://github.com/liabru/jquery-match-height#options
 * 例：
 * <div class="parent">
 *   <div class="child js-alignHeight"></div>
 *   <div class="child js-alignHeight"></div>
 * </div>
 */
export default function jsAlignHeight () {
  if($('.js-alignHeight').length) {
    $('.js-alignHeight').matchHeight();
  }
};
