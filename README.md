# Website Template
静的なWebサイトを作るためのテンプレートです。  
なるべく多くの人が使えて、少しモダンな制作環境になることを目指しています。

以下のページで詳しく確認できます。

- [Styleguide](https://manabuyasuda-website-template.netlify.com/styleguide/)
- [document/](document/)
  - [css.md](document/css.md)
  - [html.md](document/html.md)
  - [image.md](document/image.md)
  - [js.md](document/js.md)
  - [icon.md](document/icon.md)


## 確認環境
以下の環境で動作の確認をしています。

- macOS High Sierra 10.13.6
- Node.js 10.16.0

Node.jsのバージョンはnodenvで固定しています。


## 始め方
開発に必要なパッケージなどは以下のコマンドですべてインストールされます。クローン、またはダウンロードをしたあとに実行してください。

```bash
npm install
```

## ファイル構成
開発は`src`ディレクトリでおこない、テスト用の一時ファイルは`htdocs`ディレクトリに出力されます。  
`static`ディレクトリは、Gulpの処理は必要ないけれど、ファビコンや共通ファイルのような最終的に`htdocs`ディレクトリに含めたいファイルを置きます。  
`template`ディレクトリはPugファイルのテンプレートです。このテンプレートを元にファイルを作成してください。

```
root/
├── src/
│   ├── _data/
│   │   └── ja/
│   │       └── site.json
│   ├── _mixin/
│   │   ├── _all.pug
│   │   ├── _breadcrumb.pug
│   │   └── _picture.pug
│   ├── _partial/
│   │   ├── _script.pug
│   │   └── ja/
│   │       ├── _footer.pug
│   │       ├── _header.pug
│   │       └── _meta.pug
│   ├── _template/
│   │   └── ja/
│   │       └── _default.pug
│   ├── about/
│   │   └── index.pug
│   ├── assets/
│   │   ├── css/
│   │   │   ├── base/
│   │   │   │   ├── variable/
│   │   │   │   ├── function/
│   │   │   │   ├── mixin/
│   │   │   │   ├── _normalize.scss
│   │   │   │   └── _base.scss
│   │   │   ├── namespace/
│   │   │   │   ├── sitewide/
│   │   │   │   ├── structure/
│   │   │   │   ├── layout/
│   │   │   │   ├── home/
│   │   │   │   └── top/
│   │   │   ├── _print.scss
│   │   │   ├── site.scss
│   │   │   └── styleguide/
│   │   ├── svg/
│   │   ├── img/
│   │   │   ├── sitewide/
│   │   │   ├── structure/
│   │   │   └── namespace/
│   │   └── js/
│   │       ├── site.js
│   │       ├── polyfill.js
│   │       ├── util.js
│   │       └── namespace/
│   │           ├── data/
│   │           └── js/
│   └── index.pug
├── static/
├── template/
│   ├── index.html
│   ├── ssi/
│   ├── ja/
│   └── en/
├── htdocs/
├── document/
│   ├── css.md
│   ├── html.md
│   ├── image.md
│   ├── js.md
│   └── icon.md
├── aigis/
├── config/
├── README.md
├── package.json
└── gulpfile.js
```

## 開発用タスク
以下のコマンドを実行すると、開発に必要なGulpとwebpackのタスクがすべて実行されます。

```bash
npm start
```

本番環境用にビルドする場合は以下のコマンドを実行します。

```bash
npm run release
```

本番環境の動作を検証したい場合は以下のコマンドを実行します。

```bash
npm test
```

HTML・CSS・JSの整形とリントをまとめて実行します。  
（少なくとも）エラーが出ない状態にしてからプッシュします。

```bash
npm run lint
```

[HTMLHint](https://github.com/htmlhint/HTMLHint)と[gulp-w3cjs](https://github.com/callumacrae/gulp-w3cjs)でHTMLのリントとW3Cのバリデーションを実行します。

```bash
npm run htmlValidate
```

[stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard)を元にSassのリントを実行します。

```bash
npm run stylelint
```

[Airbnb JavaScriptスタイルガイド](http://mitsuruog.github.io/javascript-style-guide/)や[eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue)を元にJavaScriptのリントを実行します。

```bash
npm run eslint
```

以下のような処理がおこなわれます。

- PugをHTMLにコンパイル
- SassをCSSにコンパイル
- JSをES5にコンパイル（Vue.jsの単一ファイルコンポーネントも変換する）
- SVGスプライトの生成
- ローカルサーバーを立ち上げて動作の確認（static以下のHTMLファイルはSSIにも対応）
- HTMLのリント
- Sass（CSS）のリント
- JavaScriptのリント
- スタイルガイドの生成

## 対象ブラウザ
デフォルトでは下記のようなブラウザを対象にしています。

- IE11以降
- iOS11以降
- Android5.1以降
- その他ブラウザは最新版
