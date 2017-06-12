$(function() {

  /**
   * スマホで閲覧している場合にだけ電話番号にリンクを貼ります。
   * 要素内の文字列から数値だけを取得して、リンクに設定します。
   * 例：
   * <p>
   *   <span class="js-changePhoneLink">0120-123-456</span>
   * </p>
   *
   * 処理後：
   * <p>
   *   <span class="js-changePhoneLink"><a href="tel:0120123456">0120-123-456</a></span>
   * </p>
   */
  if(isSP) {
    $('.js-changeTelLink').each(function(){
      var $this = $(this);
      var str = $this.text();
      $this.html($('<a>').attr('href', 'tel:' + str.replace(/[^0-9]+/g, '')).append(str + '</a>'));
    });
  }

}());
