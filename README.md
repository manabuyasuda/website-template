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


## 確認環境
以下の環境で動作の確認をしています。

- macOS High Sierra 10.13.5
- Node.js 9.4.0

Node.jsのバージョンはnodenvで固定しています。


## 始め方
開発に必要なパッケージなどは以下のコマンドですべてインストールされます。クローン、またはダウンロードをしたあとに実行してください。

```bash
npm install
```

## ファイル構成
開発は`src`ディレクトリでおこない、テスト用の一時ファイルは`htdocs`ディレクトリに出力されます。  
`public`ディレクトリは、Gulpの処理は必要ないけれど、ファビコンや共通ファイルのように最終的に`htdocs`ディレクトリに含めたいファイルを置きます。  
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
│   │   ├── icon/
│   │   │   └── template/
│   │   │       └── _Icon.scss
│   │   ├── img/
│   │   │   ├── sitewide/
│   │   │   ├── structure/
│   │   │   └── namespace/
│   │   └── js/
│   │       ├── site.js
│   │       └── namespace/
│   │           ├── data/
│   │           └── js/
│   └── index.pug
├── public/
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
│   └── js.md
├── aigis/
├── README.md
├── package.json
└── gulpfile.js
```

## 開発用タスク
以下のコマンドを実行すると、開発に必要なGulpのタスクがすべて実行されます。

```bash
npm start
```

以下のような処理がおこなわれます。

- PugをHTMLにコンパイル
- SassをCSSにコンパイル
- JSをES5にトランスコンパイル（jQueryとプラグインなどもsite.jsでインポート）
- アイコンフォントの生成
- ローカルサーバーを立ち上げて動作の確認（public以下のHTMLファイルはSSIにも対応）
- スタイルガイドの生成

## 対象ブラウザ
デフォルトでは下記のようなブラウザを対象にしています。

- IE11以降
- iOS8以降
- Android4.4以降
- その他ブラウザは最新版

一部でFlexboxを使用しています。IE9以下に対応する場合は[flexibility.js](https://github.com/jonathantneal/flexibility)を使用してください。
