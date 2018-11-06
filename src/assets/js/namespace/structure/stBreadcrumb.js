/**
 * `nav`に`aria-label`を、
 * 表示中のページと同じURLのリンクに`aria-current`を追加します。
 * https://www.w3.org/TR/wai-aria-practices/examples/breadcrumb/
 */
export default function stBreadcrumb() {
  const parentName = 'st-Breadcrumb';
  const linkName = 'st-Breadcrumb_Link';
  const currentValue = 'page';
  const getLabelValue = (lang) => {
    if (lang === 'ja') return '現在位置';
    if (lang === 'en') return 'Current location';
    if (lang === 'zh-CN') return '目前的位置';
    if (lang === 'zh-TW') return '目前的位置';
    return false;
  };

  const parent = document.getElementsByClassName(parentName)[0];
  const link = document.getElementsByClassName(linkName);
  const path = window.location.pathname.replace(/index\.html$/, '');
  const html = document.getElementsByTagName('html')[0];
  const pageLang = html.getAttribute('lang');

  window.addEventListener('load', () => {
    if (!parent) return;

    if (pageLang) {
      parent.setAttribute('aria-label', getLabelValue(pageLang));
    }

    Array.from(link).forEach((item) => {
      const href = item.getAttribute('href').replace(/index\.html$/, '');
      const isMatchCurrentPage = href === path;

      if (isMatchCurrentPage) {
        item.setAttribute('aria-current', currentValue);
        item.setAttribute('tabindex', -1);
      }
    });
  });
}
