/**
 * `nav`に`aria-label`を、
 * 表示中のページと同じURLのリンクに`aria-current`を追加します。
 * https://www.w3.org/TR/wai-aria-practices/examples/breadcrumb/
 */
export default function stBreadcrumb() {
  const Selector = {
    PARENT: 'st-Breadcrumb',
    LINK: 'st-Breadcrumb_Link',
  };
  const Attr = {
    CURRENT_VALUE: 'page',
  };
  const getLabelValue = (lang) => {
    if (lang === 'ja') return '現在位置';
    if (lang === 'en') return 'Current location';
    if (lang === 'zh-CN') return '目前的位置';
    if (lang === 'zh-TW') return '目前的位置';
    return false;
  };

  const parent = document.getElementsByClassName(Selector.PARENT)[0];
  const link = document.getElementsByClassName(Selector.LINK);
  const path = window.location.pathname.replace(/index\.html$/, '');
  const pageLang = document
    .getElementsByTagName('html')[0]
    .getAttribute('lang');

  window.addEventListener('load', () => {
    if (!parent) return;

    if (pageLang) {
      parent.setAttribute('aria-label', getLabelValue(pageLang));
    }

    Array.from(link).forEach((item) => {
      const href = item.getAttribute('href').replace(/index\.html$/, '');
      const isMatchCurrentPage = href === path;

      if (isMatchCurrentPage) {
        item.setAttribute('aria-current', Attr.CURRENT_VALUE);
        item.setAttribute('tabindex', -1);
      }
    });
  });
}
