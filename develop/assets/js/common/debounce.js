/**
 * @desc - 関数などのイベントを任意の時間遅延させます。
 * @link - https://davidwalsh.name/javascript-debounce-function
 * @example
 * $(window).on('resize', debounce(function() {
 *   func1();
 *   func2();
 * }, 200));
 */
debounce = function(func, wait, immediate) {
  var timeout;

  return function() {
    var context = this;
    var args = arguments;

    var later = function() {
      timeout = null;
      if ( !immediate ) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait || 200);
    if (callNow) {
      func.apply(context, args);
    }
  };
};
