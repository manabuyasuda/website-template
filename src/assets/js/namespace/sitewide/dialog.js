/**
 * A11yに対応したダイアログ（モーダル）です。
 * 複数のダイアログを使う場合は`data-a11y-dialog-show="sw-dialog1"`とid="sw-dialog1"の値を
 * `sw-dialog2`や`sw-dialog3`のように連番で指定してください。最大で10個まで対応しています。
 * https://github.com/edenspiekermann/a11y-dialog
 * 例：
 * <div id="main">
 *   <button class="sw-Dialog_Link" data-a11y-dialog-show="sw-dialog1">ダイアログを開く</button>
 * </div>
 *
 * <div class="sw-Dialog_Dialog" id="sw-dialog1">
 *   <div class="sw-Dialog_Overlay" tabindex="-1" data-a11y-dialog-hide></div>
 *   <dialog class="sw-Dialog_Content" role="dialog" aria-labelledby="dialog-title" aria-describedby="dialogDescription">
 *     <div class="sw-Dialog_Inner">
 *       <div class="sw-Dialog_Head">
 *         <button class="sw-Dialog_Close" type="button" data-a11y-dialog-hide="data-a11y-dialog-hide" aria-label="この画面を閉じる">
 *           <svg role="img" class="sw-Dialog_CloseIcon">
 *             <use xlink:href="/assets/svg/sprite.svg#close1"></use>
 *           </svg>
 *         </button>
 *       </div>
 *       <div class="sw-Dialog_Body">
 *         <h3 id="dialog-title">ダイアログ1のタイトル</h3>
 *         <p id="dialogDescription">ダイアログ1の概要</p>
 *         <p><code>aria-labelledby</code>と<code>aria-describedby</code>で、タイアログのタイトルと概要を紐づけています。</p>
 *       </div>
 *     </div>
 *   </dialog>
 * </div>
 */
import $ from 'jquery';
import A11yDialog from 'a11y-dialog';
export default function sitewideDialog() {
  // ダイアログのID名。1から始まる連番が追加される。
  const dialogName = 'sw-dialog';
  // メインコンテンツのID名。ダイアログはこのID要素と兄弟関係になるようにする。
  const container = document.getElementById('main');
  // ダイアログを開く直前のスクロール位置。
  let openBeforeLocation = 0;

  generateInstance();

  /**
   * 画面を固定する。
   */
  function fixScreen() {
    openBeforeLocation = window.pageYOffset;

    $('html, body').css({
      'width': '100vw',
      'height': '100vh',
      'overflow': 'hidden',
      'position': 'absolute',
      'top': '0',
      'left': '0'
    });
  }

  /**
   * 画面の固定を解除、ダイアログを開く前のスクロール位置に戻す。
   */
  function cancelScreenFixed() {
    $('html, body').css({
      'width': '',
      'height': '',
      'overflow': '',
      'position': '',
      'top': '',
      'left': ''
    });

    $('html, body').scrollTop(openBeforeLocation);
  }

  /**
   * ダイアログのインスタンスを複数生成する。
   */
  function generateInstance() {
    // 生成するタイアログの数。
    const dialogCount = 10;

    for (let i = 0; i < dialogCount; i++) {
      const sequenceDialog = `${dialogName}${i + 1}`;
      const dialog = document.getElementById(sequenceDialog);

      if (dialog) {
        const sequenceDialog = new A11yDialog(dialog, container);

        // ダイアログを表示したときの処理
        sequenceDialog.on('show', function (dialogEl, event) {
          fixScreen();
        });
        // ダイアログを非表示にしたときの処理
        sequenceDialog.on('hide', function (dialogEl, event) {
          cancelScreenFixed();
        });
      }
    }
  }

};
