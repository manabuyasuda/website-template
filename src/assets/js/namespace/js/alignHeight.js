/**
 * 同じ行にある要素の高さを揃えます。
 * 複数の箇所で使用する場合は、`js-alignHeight1`や`js-alignHeight2`のように連番で指定してください。
 * https://github.com/appleple/responsive-auto-height
 * 例：
 * <div class="parent">
 *   <div class="child">
 *     <h2 class="js-alignHeight1"></h2>
 *     <p class="js-alignHeight2"></p>
 *   </div>
 *   <div class="child">
 *     <h2 class="js-alignHeight1"></h2>
 *     <p class="js-alignHeight2"></p>
 *   </div>
 * </div>
 */
 import ResponsiveAutoHeight from 'responsive-auto-height';
 export default function jsAlignHeight() {
  // 使用するクラス名。
   const baseName = 'js-alignHeight';
   // `baseName`+1桁以上の連番。
   const regexp = new RegExp(`${baseName}[0-9]{1,}`);
   const allSelector = document.querySelectorAll(`[class*=${baseName}]`);
   let classNames = [];

   // 該当する要素のクラス名を`classNames`に格納する。
   Array.prototype.slice.call(allSelector, 0).forEach(item => {
    const className = item.className;
    const itemName = className.match(regexp)[0];
    classNames.push(itemName);
   });

   // 重複したクラス名を削除する。
   const target = classNames.filter((className, i, self) => {
    return self.indexOf(className) === i;
   });

   target.forEach(className => {
     new ResponsiveAutoHeight(`.${className}`);
   });

 };
