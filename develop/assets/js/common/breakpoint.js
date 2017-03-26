/**
 * @desc - `body:before`に指定したブレイクポイントを取得します。
 * @link - https://www.lullabot.com/articles/importing-css-breakpoints-into-javascript
 * @example: ブレイクポイント`md`以上の場合
 * if(breakpoint.value === 'md' || breakpoint.value === 'lg') {}
 * @example: ブレイクポイント`lg`以上の場合
 * if(breakpoint.value === 'lg') {}
 */
var breakpoint = {};
breakpoint.refreshValue = function () {
  this.value = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '');
};
$(window).resize(function () {
  breakpoint.refreshValue();
}).resize();
