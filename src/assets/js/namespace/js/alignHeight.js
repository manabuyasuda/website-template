/**
 * 同じ行にある要素の高さを揃えます。
 * https://github.com/liabru/jquery-match-height#options
 * 例：
 * <div class="parent">
 *   <div class="child js-alignHeight"></div>
 *   <div class="child js-alignHeight"></div>
 * </div>
 *
 * 異なるDOM構造を持っている場合は、`data-mh="group1"`のようにグループ化することができます。
 * https://github.com/liabru/jquery-match-height#data-api
 * 例：
 * <div class="parent">
 *   <div class="js-alignHeight" data-mh="group1"></div>
 *   <div>
 *     <div class="js-alignHeight" data-mh="group1"></div>
 *   </div>
 * </div>
 */
import $ from 'jquery';
import 'jquery-match-height';
export default function jsAlignHeight() {
  if($('.js-alignHeight').length) {
    $('.js-alignHeight').matchHeight();
  }
};
