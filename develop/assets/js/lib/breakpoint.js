/**
 * @desc - `body:before`に指定したブレイクポイントを取得します。
 * @link - https://www.lullabot.com/articles/importing-css-breakpoints-into-javascript
 * @example: ブレイクポイント1px以上の場合
 * if(breakpoint.value === 'none') {}
 * @example: ブレイクポイント1px以上もしくは`md`の場合
 * if(breakpoint.value === 'none' || breakpoint.value === 'md') {}
 */
var breakpoint = {};
breakpoint.refreshValue = function () {
  this.value = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '');
};
$(window).resize(function () {
  breakpoint.refreshValue();
}).resize();
