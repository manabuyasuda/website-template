# CSS
CSSは[Sass](http://sass-lang.com/)を使って生成しています。  
その他の機能としてPostCSSなどを使って、いくつかの処理をしています。

- gulp-sass-glob：（`**/*`のような）Globパターンを使った@import
- autoprefixer：ベンダープレフィックスの付与
- clean-css：スペースの削除や省略可能なコードの削除（最適化）

## CSS設計手法
CSSは[ECSS](http://ecss.io/)をベースにしています。特徴としては、グローバルなModuleを最小限にすること、使う場所や状況によって名前空間をつくることで影響範囲を意図的に狭くすることです。  
詳しくは[ECSSの特徴をまとめたドキュメント](https://github.com/manabuyasuda/styleguide/blob/master/how-to-ecss.md)を確認してください。

## ディレクトリ構造
`develop/assets/css`以下にあるアンダースコア付きの`.scss`ファイルが`site.scss`によってインポートされます。

ECSSの考え方をベースに、以下の5つのレイヤーに大きくわかれています。

1. site.scss
2. base
3. namespace/SiteWide
4. namespace/Structure
5. namespace

SiteWideはリストやボタンのような場所を選ばない汎用的なModuleです。  
Structureはヘッダーやフッター、パンくずリストやサイドメニューのように使う場所が固定されているModuleです。  
共通のレイアウトやグリッドシステムはnamespace/layoutに定義していきます。

namespaceには名前空間ごとにディレクトリを作り、さらにModuleごとにファイルを作ります。

```
.
├── base/
│   ├── _normalize.scss
│   ├── _base.scss
│   ├── _Icon.scss
│   ├── variable
│   │   ├── _breakpoint.scss
│   │   ├── _font-family.scss
│   │   └── _global.scss
│   ├── function
│   │   ├── _rem.scss
│   │   └── _str-replace.scss
│   ├── mixin
│   │   ├── _Button.scss
│   │   ├── _FormCheckbox.scss
│   │   ├── _FormInput.scss
│   │   ├── _FormRadio.scss
│   │   ├── _FormSelect.scss
│   │   ├── _FormTextarea.scss
│   │   ├── _Label.scss
│   │   ├── _Link.scss
│   │   ├── _clearfix.scss
│   │   ├── _font-face.scss
│   │   ├── _mq-up.scss
│   │   ├── _on-event.scss
│   │   └── _sr-only.scss
├── namespace
│   ├── SiteWide
│   │   ├── _Button.scss
│   │   ├── _Delimiter.scss
│   │   ├── _Divider.scss
│   │   ├── _Embed.scss
│   │   ├── _FormCheckbox.scss
│   │   ├── _FormInput.scss
│   │   ├── _FormRadio.scss
│   │   ├── _FormSelect.scss
│   │   ├── _FormTextarea.scss
│   │   ├── _Hide.scss
│   │   ├── _Label.scss
│   │   ├── _Link.scss
│   │   ├── _LinkDownload.scss
│   │   ├── _LinkExternal.scss
│   │   ├── _LinkMore.scss
│   │   ├── _LinkNote.scss
│   │   ├── _LinkPdf.scss
│   │   ├── _ListBracketOrder.scss
│   │   ├── _ListNote.scss
│   │   ├── _ListNoteOrder.scss
│   │   ├── _ListOrder.scss
│   │   ├── _ListUnorder.scss
│   │   ├── _Show.scss
│   │   ├── _TableScroll.scss
│   │   ├── _TextAttention.scss
│   │   ├── _TextEmphasis.scss
│   │   └── _TextSecondary.scss
│   ├── Structure
│   │   ├── _Wrapper.scss
│   │   ├── _Header.scss
│   │   ├── _Footer.scss
│   │   └── _Breadcrumb.scss
│   ├── layout
│   │   ├── _Home.scss
│   │   ├── _Top.scss
│   │   ├── _Detail.scss
│   │   ├── _Grid.scss
│   │   └── _Grids.scss
│   ├── home
│   ├── top
│   ├── products
│   ├── company
│   ├── csr
│   ├── faq
│   ├── inquiry
│   ├── ir
│   ├── news
│   ├── recruit
│   ├── results
│   └── sitemap
├── site.scss
└── styleguide
    ├── _IconList.scss
    └── index.md
```

## namespace
`namespace/`にはECSSの考えをベースに名前空間でディレクトリをわけます。  
例えば以下のように名前をつけます。

 - `.layout-` (Layout) カテゴリー共通やページごとのレイアウト、グリッドシステム
 - `.home-` (HomePage) ホームページ（サイトトップページ）
 - `.top-` (CategoryTop) カテゴリートップページ
 - `.products-` (Products) 製品情報

名前空間に続いてModuleごとにファイルをわけていきます。Moduleは名前空間内にある、機能面のある程度大きな区分のことをいいます。JavaScriptで動的にクラスを追加するときの、いちばん外側の要素と考えてもいいと思います。  
例えば以下のように名前をつけます。

- `.layout-Home` ホームページのレイアウト
- `.layout-Top` カテゴリートップのレイアウト
- `.layout-Detail` 詳細（下層）ページのレイアウト

## Sass
Sassには変数や、便利なmixinをいくつか用意しています。

### メディアクエリ
`base/mixin/_mq-up.scss`にはメディアクエリを一括管理するmixinが用意されています。

例えば引数にブレイクポイントのキーワードを渡すと、

```scss
.foo {
  @include mq-up(md) {
    display: block;
  }
}
```

メディアクエリが出力されます。

```scss
@media (min-width: 768px) {
  .foo {
    display: block;
  }
}
```

ブレイクポイントは`base/variable/_breakpoint.scss`で定義しています。`md`と`lg`はデフォルトで使用しているので、名前は変更しないでください。

```scss
$breakpoint-up: (
  'md': '(min-width: 768px)',
  'lg': '(min-width: 1080px)',
  'xl': '(min-width: 1440px)',
) !default;
```

また、`mq-up()`のように引数を渡さない場合の初期値は`base/variable/_global.scss`の`$default-breakpoint`で定義されています。  
引数なしの`mq-up()`を使うと、`$default-breakpoint`で一括管理できるようになるので管理がしやすくなります。

## アイコンフォント
アイコンは基本的にSVGを背景画像で表示しますが、背景画像でカバーできないスタイルの場合はアイコンフォントを使います。

`develop/assets/icon/`にSVGを保存すると自動でアイコンフォントとCSSが生成されます。生成されたアイコンフォントは`css/base/_Icon.scss`に出力されます。

基本的にはこのように専用のクラスを指定します。

```jade
p More
  span.sw-Icon.sw-Icon-linkMore(aria-hidden="true")
```

mixinと変数でアイコンフォントのスタイルを呼び出すこともできるので活用してください。

```scss
.sw-LinkMore_Icon:after {
  @include icon; // アイコンフォントのベーススタイル
  content: "#{$icon-linkMore}"; // アイコンフォントの種類を指定
  top: -0.1em;
  left: 0.25em;
  font-size: 0.8em;
}
```

生成したアイコンフォントは`/styleguide/Icon.html`で確認できます。
