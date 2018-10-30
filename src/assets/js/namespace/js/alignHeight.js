/**
 * 同じ行にある要素の高さを揃えます。
 * 複数の箇所で使用する場合は、`js-AlignHeight1`や`js-AlignHeight2`のように連番で指定してください。
 * https://github.com/appleple/responsive-auto-height
 * 例：
 * <div class="parent">
 *   <div class="child">
 *     <h2 class="js-AlignHeight1"></h2>
 *     <p class="js-AlignHeight2"></p>
 *   </div>
 *   <div class="child">
 *     <h2 class="js-AlignHeight1"></h2>
 *     <p class="js-AlignHeight2"></p>
 *   </div>
 * </div>
 */
import ResponsiveAutoHeight from 'responsive-auto-height';

export default function jsAlignHeight() {
  const Selector = {
    BASE_CLASS: 'js-AlignHeight', // 使用するクラス名。
  };

  // `baseName`+1桁以上の連番。
  const regexp = new RegExp(`${Selector.BASE_CLASS}[0-9]{1,}`);
  const allSelector = document.querySelectorAll(
    `[class*=${Selector.BASE_CLASS}]`,
  );
  const classNames = [];

  if (!allSelector.length) return;

  // 該当する要素のクラス名を`classNames`に格納する。

  Array.from(allSelector).forEach((selector) => {
    const { className } = selector;
    const itemName = className.match(regexp)[0];
    classNames.push(itemName);
  });

  // 重複したクラス名を削除する。
  const target = classNames.filter(
    (className, i, self) => self.indexOf(className) === i,
  );

  Array.from(target).forEach((className) => {
    let rah = className; // eslint-disable-line
    rah = new ResponsiveAutoHeight(`.${className}`);
  });
}
