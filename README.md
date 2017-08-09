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

- OS X 10.11.5(El Capitan)
- Node.js 4.2.4
- Yarn 0.21.3


## 始め方
開発に必要なパッケージなどは以下のコマンドですべてインストールされます。クローン、またはダウンロードをしたあとに実行してください。

```bash
yarn install
```

Yarnをインストールしていない場合はグローバルにインストールしてください。

```bash
npm install -g yarn
```

詳しくは[Yarnの公式ドキュメント](https://yarnpkg.com/en/docs/install)を参照してください。

Yarnを使用しない場合は、yarn.lockファイルを削除して、以下のコマンドを実行してください。

```bash
npm install
```

## ファイル構成
開発は`develop`ディレクトリでおこない、テスト用の一時ファイルは`test`ディレクトリに出力、公開用のファイルは`htdocs`ディレクトリに出力されます。  
`public`ディレクトリは処理は必要ないけれど、ファビコンのようなサイト制作に必要なファイルを置きます。

```
root/
├── README.md
├── aigis/
├── develop/
│   ├── _data/
│   ├── _partial/
│   │   ├── _meta.pug
│   │   └── _header.pug
│   ├── _template/
│   │   └── _default.pug
│   ├── _mixin/
│   │   ├── _breadcrumb.pug
│   │   ├── _picture.pug
│   │   └── _all.pug
│   ├── assets/
│   │   └── css/
│   │       ├── base/
│   │       ├── namespace/
│   │       └── site.scss
│   │   ├── icon/
│   │   │   └── template/
│   │   │       └── _Icon.scss
│   │   ├── img/
│   │   └── js/
│   │       ├── jquery.min.js
│   │       ├── jquery-migrate.min.js
│   │       ├── lib/
│   │       └── namespace/
│   │           ├── js/
│   │           └── data/
│   └── index.pug
├── document/
│   ├── css.md
│   ├── html.md
│   ├── image.md
│   └── js.md
├── gulpfile.js
├── package.json
└── public/
```

## 開発用タスク
以下のコマンドを実行すると、開発に必要なGulpのタスクがすべて実行されます。

```bash
yarn start
```

Yarnを使用しない場合は、以下のコマンドを実行してください。

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

以下のコマンドを実行すると、本番公開用のファイルが出力されます。

```bash
yarn run release
```

Yarnを使用しない場合は、以下のコマンドを実行してください。

```bash
npm run release
```

## 対象ブラウザ
デフォルトでは下記のようなブラウザを対象にしています。

- IE9以降
- iOS8以降
- Android4.4以降
- その他ブラウザは最新版
