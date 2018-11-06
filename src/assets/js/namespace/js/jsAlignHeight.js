/**
 * 同じ行にある要素の高さを揃えます。
 * 複数の箇所で使用する場合は、
 * `js-AlignHeight1`や`js-AlignHeight2`のように連番で指定してください。
 * https://github.com/appleple/responsive-auto-height
 */
import ResponsiveAutoHeight from 'responsive-auto-height';

export default function jsAlignHeight() {
  // 使用するクラス名。
  const baseName = 'js-AlignHeight';

  // `baseName`+1桁以上の連番。
  const regexp = new RegExp(`${baseName}[0-9]{1,}`);
  const allSelector = document.querySelectorAll(`[class*=${baseName}]`);

  if (!allSelector.length) return;

  // 使用するクラス名だけを抽出する。
  const classNames = Array.from(allSelector).map(selector => selector.className.match(regexp)[0]);

  // 重複したクラス名を削除する。
  const targets = classNames.filter((className, i, self) => self.indexOf(className) === i);

  // インスタンス化する。
  targets.forEach((target) => {
    const rah = new ResponsiveAutoHeight(`.${target}`); // eslint-disable-line
  });
}
