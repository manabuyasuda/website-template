# CSS
CSSは[Sass](http://sass-lang.com/)を使って生成しています。  
その他の機能としてPostCSSを使って、いくつかの処理をしています。

- gulp-sass-glob：Globパターンを使った@import
- autoprefixer：ベンダープレフィックスの付与
- csswring：スペースの削除や省略可能なコードの削除

## CSS設計手法
CSSは[ECSS](http://ecss.io/)をベースにしています。特徴としては、グローバルなModuleを最小限にすること、使う場所や状況によって名前空間をつくることで影響範囲を意図的に狭くすることです。  
詳しくは[ECSSの特徴をまとめたドキュメント](https://github.com/manabuyasuda/styleguide/blob/master/how-to-ecss.md)を確認してください。

## ディレクトリ構造
`develop/assets/css`以下にあるアンダースコア付きの`.scss`ファイルが`common.scss`によってインポートされます。

ECSSの考え方をベースにした、以下の5つに大きくわかれています。

1. common.scss
2. base
3. SiteWide
4. Structure
5. module

SiteWideはよく使うスタイルを用意しています。  
グリッドはStructureに用意しています。ヘッダーやグローバルナビなどは用意していないので追加してください。

moduleには名前空間ごとにディレクトリを作り、さらにModuleごとにファイルを作ります。

```
css
├── SiteWide // サイト共通の小さなパーツ
│   ├── _Button.scss
│   ├── _Divider.scss
│   ├── _Embed.scss
│   ├── _FormCheckbox.scss
│   ├── _FormInput.scss
│   ├── _FormRadio.scss
│   ├── _FormSelect.scss
│   ├── _FormTextarea.scss
│   ├── _Icon.scss
│   ├── _Label.scss
│   ├── _Link.scss
│   ├── _LinkDownload.scss
│   ├── _LinkExternal.scss
│   ├── _LinkMore.scss
│   ├── _LinkNote.scss
│   ├── _LinkPdf.scss
│   ├── _ListBracketOrder.scss
│   ├── _ListNote.scss
│   ├── _ListNoteOrder.scss
│   ├── _ListOrder.scss
│   ├── _TextAttention.scss
│   ├── _TextEmphasis.scss
│   ├── _TextSecondary.scss
│   └── _break.scss
├── Structure // サイト共通の構造
│   ├── _Grid.scss
│   ├── _Grids.scss
├── base // サイトのベーススタイル
│   ├── _base.scss
│   ├── _normalize.scss
│   ├── function
│   ├── mixin
│   └── variable
├── common.scss
└── module // コンテキスト（Moduleや名前空間）ごとのファイル
    └── TopPage
        └── _Module1.scss
```

## Module
`module/`にはECSSの考えをベースに名前空間でディレクトリをわけます。  
例えば以下のように名前をつけます。

- トップページ：`.tp-`(TopPage)
- よくある質問ページ：`.faq-`(Frequently asked questions)
- 製品情報トップページ：`.pdt-`(ProDuct Top)
- 製品情報詳細ページ：`.pdd-`(ProDuct Detail)

名前空間に続いてModuleごとにファイルをわけていきます。Moduleは使う場所や状況に基づいた、機能面のある程度大きな区分のことをいいます。JavaScriptで動的にクラスを追加するいちばん外側の要素と考えてもいいと思います。  
例えば以下のように名前をつけます。

- `.tp-Header`
- `.tp-Hero`
- `.tp-Content`
- `.tp-Footer`
- `.tp-Heading`

## Sass
Sassには変数や、便利なmixinをいくつか用意しています。

### メディアクエリ
`base/mixin/_mq-up.scss`にはメディアクエリを一括管理するmixinが用意されています。

例えばこのように、引数にブレイクポイントのキーワードを渡すと、

```scss
.foo {
  @include mq-up(md) {
    display: block;
  }
}
```

このようにメディアクエリが出力されます。

```scss
@media (min-width: 768px) {
  .foo {
    display: block;
  }
}
```

ブレイクポイントは`base/variable/_breakpoint.scss`で定義しています。

```scss
$breakpoint-up: (
  'md': '(min-width: 768px)',
  'lg': '(min-width: 1080px)',
  'xl': '(min-width: 1440px)',
) !default;
```

また、`mq-up()`のように引数を渡さない場合の初期値は`base/variable/_global.scss`の`$default-breakpoint`で定義されています。  
基本的には引数なしで`mq-up()`を使うと管理がしやすくなります。

## アイコンフォント
アイコンは基本的にSVGを背景画像で表示しますが、背景画像で表現ができない場合はアイコンフォントを使います。

`develop/assets/icon/`にSVGを保存すると自動でアイコンフォントが生成されます。生成されたアイコンフォントは`css/SiteWide/_Icon.scss`に出力されます。

基本的にはこのように専用のクラスを指定します。

```jade
p More
  span.sw-Icon.sw-Icon-linkMore(aria-hidden="true")
```

mixinと変数でアイコンフォントのスタイルを呼び出すこともできるので活用してください。

```scss
.sw-LinkMore_Icon:after {
  @include icon;
  content: "#{$icon-linkMore}";
  top: -0.1em;
  left: 0.25em;
  font-size: 0.8em;
}
```

生成したアイコンフォントは`test/styleguide/Icon.html`で確認できます。
