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

- OS X 10.11.6(El Capitan)
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
│   │   │   │   ├── SiteWide/
│   │   │   │   ├── Structure/
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
│   │   │   ├── SiteWide/
│   │   │   ├── Structure/
│   │   │   └── namespace/
│   │   └── js/
│   │       ├── jquery-migrate.min.js
│   │       ├── jquery.min.js
│   │       ├── lib/
│   │       │   ├── jquery.matchHeight-min.js
│   │       │   ├── lodash.custom.min.js
│   │       │   └── picturefill.min.js
│   │       └── namespace/
│   │           ├── data/
│   │           └── js/
│   └── index.pug
├── public/
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
- JSを連結・圧縮
- アイコンフォントの生成
- ローカルサーバーを立ち上げて動作の確認（オプションとしてSSIにも対応）
- スタイルガイドの生成

## 対象ブラウザ
デフォルトでは下記のようなブラウザを対象にしています。

- IE9以降
- iOS8以降
- Android4.4以降
- その他ブラウザは最新版
