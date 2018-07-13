/**
 * スマホで閲覧している場合にだけ電話番号にリンクを貼ります。
 * 要素内の文字列からハイフンとスペースなどの空白文字を削除してリンクに設定します。
 * 例：
 * <p>
 *   <span class="js-changeTelLink"> +0120-123-456</span>
 * </p>
 *
 * 処理後：
 * <p>
 *   <span class="js-changeTelLink"><a href="tel:+0120123456"> +0120-123-456</a></span>
 * </p>
 */
export default function jsChangeTelLink () {
  var ua = navigator.userAgent.toLowerCase();
  var isiPhone = (ua.indexOf('iphone') > -1) && (ua.indexOf('ipad') == -1);
  var isAndroid = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') > -1);
  var isSP = (isiPhone || isAndroid);

  if(isSP && $('.js-changeTelLink').length) {
    $('.js-changeTelLink').each(function(){
      var $this = $(this);
      var str = $this.text();
      $this.html($('<a>').attr({
        href: 'tel:' + str.replace(/[\-\s]/g, ''),
        class: null // リンクに付与するクラス（例：'sw-LinkTel'）
      }).append(str + '</a>'));
    });
  }
};
