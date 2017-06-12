  var ua = navigator.userAgent.toLowerCase();
  var ver = navigator.appVersion.toLowerCase();
  var isiPhone = (ua.indexOf('iphone') > -1) && (ua.indexOf('ipad') == -1);
  var isiPad = (ua.indexOf('ipad') > -1);
  var isAndroid = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') > -1);
  var isAndroidTablet = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') == -1);
  var isTablet = (isiPad || isAndroidTablet);
  var isSP = (isiPhone || isAndroid);
