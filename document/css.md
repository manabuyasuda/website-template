# CSS
CSSは[Sass](http://sass-lang.com/)を使って生成しています。  
その他の機能としてPostCSSなどを使って、いくつかの処理をしています。

- gulp-sass-glob：（`**/*`のような）Globパターンを使った@import
- autoprefixer：ベンダープレフィックスの付与
- clean-css：スペースの削除や省略可能なコードの削除（最適化）

## CSS設計手法
CSSは[ECSS](http://ecss.io/)をベースにしています。特徴としては、名前空間をつけることでモジュールの使用範囲や影響範囲を明確にしていることがあります。  
詳しくは[ECSSの特徴をまとめたドキュメント](https://github.com/manabuyasuda/styleguide/blob/master/how-to-ecss.md)を確認してください。

## ディレクトリ構造
`src/assets/css`以下にあるアンダースコア付きの`.scss`ファイルが`site.scss`によってインポートされます。

ECSSの考え方をベースに、以下の5つのレイヤーに大きくわかれています。

1. site.scss
2. base
3. namespace/sitewide
4. namespace/structure
4. namespace/layout
5. namespace

baseには変数や関数、タイプセレクタのベーススタイルなどがあります。

sitewideはリストやボタンのような場所を選ばない汎用的なモジュールです。

structureはヘッダーやフッター、パンくずリストやサイドメニューのように使う場所が固定されている構造的なモジュールです。

layoutはコンテンツ内の余白やレイアウトを指定するレイアウト専用のモジュールです。

namespaceには名前空間ごとにディレクトリを作り、さらにModule（Component）ごとにファイルを作ります。  
namespace以下によくあるディレクトリを作っていますが、案件によって追加・削除してください。

```
css/
├── _print.scss
├── base/
│   ├── _base.scss
│   ├── _normalize.scss
│   ├── function/
│   ├── mixin/
│   └── variable/
├── namespace/
│   ├── sitewide/
│   ├── structure/
│   ├── layout/
│   ├── company/
│   ├── csr/
│   ├── faq/
│   ├── home/
│   ├── inquiry/
│   ├── ir/
│   ├── news/
│   ├── products/
│   ├── recruit/
│   ├── results/
│   ├── sitemap/
│   ├── sub/
│   ├── test/
│   ├── top/
│   └── wisywig/
├── site.scss
└── styleguide/
    └── index.md
```

## namespace
`namespace/`にはECSSの考えをベースに名前空間でディレクトリをわけます。  
例えば以下のように名前をつけます。

 - `.sw-` (Sitewide) サイト共通の汎用的なModule（リストやボタンなどの場所を選ばないもの）
 - `.st-` (Structure)サイト共通の構造的なModule（ヘッダーやフッター、カテゴリーごとの大枠のレイアウト、グリッドシステムやコンポーネンの余白など）
 - `.home-` (HomePage) ホームページ（サイトトップページ）
 - `.top-` (CategoryTop) カテゴリートップページ
 - `.products-` (Products) 製品情報

名前空間に続いてModule（Component）ごとにファイルをわけていきます。Module（Component）は名前空間内にある、機能面のある程度大きな区分のことをいいます。JavaScriptで動的にクラスを追加するときの、いちばん外側の要素と考えてもいいと思います。  
例えば以下のように名前をつけます。

- `.home-Title` ホームページのタイトル
- `.home-Hero` ホームページのメインビジュアル
- `.home-News` ホームページのニュースエリア

## Sass
Sassには変数や、便利なmixinをいくつか用意しています。

### メディアクエリ
メディアクエリのmixinは[Sass MQ](https://github.com/sass-mq/sass-mq)を使用しています。

以下のように指定します。

```scss
.min-width {
  @include mq(md) {
    content: "@media (min-width:48em)";
  }
}

.max-width {
  @include mq($until: md) {
    content: "@media (max-width:47.99em)";
  }
}

.min-and-max-width {
  @include mq(md, lg) {
    content: "@media (min-width:48em) and (max-width:63.99em)";
  }
}

.print {
  @include mq($media-type: "print") {
    content: "@media print";
  }
}

.screen-and-high-contrast-and-print {
  @include mq($media-type: "screen and (-ms-high-contrast: active), print") {
    content: "@media screen and (-ms-high-contrast:active), print";
  }
}
```

メディアクエリが出力されます。

```scss
@media (min-width: 48em) {
  .min-width {
    content: "@media (min-width:48em)"
  }
}

@media (max-width:47.99em) {
  .max-width {
    content: "@media (max-width:47.99em)"
  }
}

@media (min-width:48em) and (max-width:63.99em) {
  .min-and-max-width {
    content: "@media (min-width:48em) and (max-width:63.99em)"
  }
}

@media print {
  .print {
    content: "@media print"
  }
}

@media screen and (-ms-high-contrast:active), print {
  .screen-and-high-contrast-and-print {
    content: "@media screen and (-ms-high-contrast:active), print"
  }
}
```

ブレイクポイントは`base/variable/_mq.scss`で定義しています。

```scss
$mq-breakpoints: (
  sm: 375px,
  md: 768px,
  lg: 1024px,
  xl: 1440px,
);
```

詳しくは[Sass MQ](https://sass-mq.github.io/sass-mq/)を参照してください。
