# HTML
HTMLは[Pug](https://pugjs.org/api/getting-started.html)を使って生成しています。  
通常のHTMLとは構文が違いますが、共通部分などの全体の管理がしやすいところや、コーディング速度や修正がしやすいメリットがあるので採用しています。

インデントにスペースやタブが混ざるとエラーになってしまうので、.editorconfigを設定することで解決しています。お使いのエディターで.editorconfigの設定が反映されるように設定してください。

## ディレクトリ構造
Pugのコンパイルは、例えば`develop/index.pug`が`test/index.html`のように生成されます。  
`_partial/`は共通部分など、`_template/`は共通部分をまとめたテンプレート、`_data/`はサイトやページ単位で使うデータ（JSON）、`_mixin/`はPugのmixinを保存します。`_index.pug`のようにアンダースコアから始まるファイルは直接出力されません。  
多言語対応のため、一部のPugファイルは`ja/`や`en/`のように言語ごとにディレクトリを分けています。

これ以降は日本語サイト用の説明をします。英語版のディレクトリもありますが、適宜読み替えてください。

```
develop/
├── _data/
│   └── ja/
│       └── site.json
├── _mixin/
│   ├── _all.pug
│   ├── _breadcrumb.pug
│   └── _picture.pug
├── _partial/
│   ├── _script.pug
│   └── ja/
│       ├── _footer.pug
│       ├── _header.pug
│       └── _meta.pug
├── _template/
│   └── ja/
│       └── _default.pug
├── about/
│   └── index.pug
└── index.pug
```

### _data
`develop/_data/`はすべてのPugファイルから参照できるサイト共通のデータを設定しています。

```js
{
  "name": "サイト名",
  "description": "サイトの概要",
  "keywords": "サイトのキーワード1, サイトのキーワード2",
  "ogpImage": "/ogp.jpg",
  "fbAppId": "",
  "fbAdmins": "",
  "twitterCard": "summary_large_image",
  "twitterSite": "@SiteAccount"
}
```

gulpfile.jsで以下のように記述しているので、`ja.site.name`のようにしてデータを取得することができます。

```js
  var locals = {
    'site': JSON.parse(fs.readFileSync(develop.data + 'site.json'))
  };
  locals.ja = {
    // 日本語サイト共通のデータです。
    'site': JSON.parse(fs.readFileSync(develop.data + 'ja/site.json'))
  };
```

### _partial
`develop/_partial/`にはサイトの共通部分が保存されています。ディレクトリごとの共通部分も含めて、自由に追加してください。

```
develop/
├── _partial/
│   ├── _script.pug
│   ├── _hreflang.pug
│   └── ja/
│       ├── _footer.pug
│       ├── _header.pug
│       └── _meta.pug
└── index.pug
```

#### _meta.pug
`_partial/_meta.pug`は`<head>`タグ内にあるメタタグをまとめて管理するためのファイルです。  
変更する可能性のある箇所が2つあるので確認してください。

初期値ではページタイトルとサイトタイトルは` | `で区切られています。` - `のようにしたい場合などは変更してください。

```pug
if pageTitle
  title #{pageTitle} | #{ja.site.name}
else
  title #{ja.site.name}

if pageOgpTitle
  meta(property="og:title" content=pageOgpTitle + ' | ' + ja.site.name)
else
  meta(property="og:title" content=ja.site.name)
```

CSSのファイル名を変えたい場合は変更してください。

```pug
block css
  link(rel="stylesheet" href="/assets/css/site.css")
```


#### _script.pug
`_partial/_script.pug`ではJavaScriptを読み込むための記述があります。ファイル名を変えたり、読み込むファイルを増やしたい場合は変更してください。

```pug
block js
  script(src='//code.jquery.com/jquery-3.2.1.min.js', integrity='sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=', crossorigin='anonymous')
  script window.jQuery || document.write('<script src="/assets/js/jquery.min.js"><\/script>')
  script(src='//code.jquery.com/jquery-migrate-3.0.0.min.js', integrity='sha256-JklDYODbg0X+8sPiKkcFURb5z7RvlNMIaE3RA2z97vw=', crossorigin='anonymous')
  script window.jQuery || document.write('<script src="/assets/js/jquery-migrate.min.js"><\/script>')
  script(src="/assets/js/lib.js")
  script(src="/assets/js/site.js")
```

#### _hreflang.pug
ドメイン内で国や言語でディレクトリを分けている場合に使います。

[言語や地域の URL に hreflang を使用する - Search Console ヘルプ](https://support.google.com/webmasters/answer/189077?hl=ja)

```pug
//- link(rel="alternate" hreflang="ja" href="https://www.example.com/")
//- link(rel="alternate" hreflang="en" href="https://www.example.com/en/")
```

### _mixin
`_partial/_mixin/`ではPugで使用するmixinが保存されています。mixinは`_partial/_mixin/_all.pug`でまとめてインクルードされます。`_all.pug`は`_template/_default.pug`でインクードされます。  
mixinを追加した場合は`_partial/_mixin/_all.pug`でインクルードするようにしてください。

### index.pug
ページの作成をする場合は、通常のHTMLと同じように`index.pug`や`about/index.pug`のように名前をつけます。

`index.pug`は以下のような構成になっています。

```pug
extend /_template/ja/_default
append variables
  //- 変更可能
  - var pageTitle= "";
  - var pageDescription= ja.site.description;
  - var pageKeywords= ja.site.keywords;
  //- 任意
  - var pageOgpTitle= pageTitle;
  - var pageOgpImage= ja.site.ogpImage;
  - var pageOgpType= "website";

block content
```

`append variables`以下では`var`に続く変数を変更することで出力される内容を変えることができます。

- `pageTitle`：そのページのタイトルを記述します。空にするとサイトのタイトルが、文字列（ページタイトル）を記述すると文字列とサイトタイトルの両方が出力されます。必須です。
- `pageDescription`：そのページの概要を記述します。必須です。
- `pageKeywords`：そのページのキーワードを記述します。値を空にすると出力されません。
- `pageOgpTitle`：OGPで使用するタイトルを記述します。ページのタイトルと同じ場合は変数`pageTitle`を記述、違う場合は文字列で記述してください。
- `pageOgpImage`：OGPで使用する画像へのパスを、ルート相対パスで記述します（`_default.pug`でhttp(s)から始まるURLは補完されます）。サイト共通の画像を指定する場合は`ja.site.ogpImage`のままにしておきます。
- `pageOgpType`：そのページの種類を記述します。サイトトップページは`website`、それ以外は`article`を指定します。


`block append`を追加することで、ページごとに個別のCSSやJSファイルの読み込みをすることができます。

```pug
//- 個別CSSファイルの読み込み（相対パス）
block append css
  - link(rel="stylesheet" href="css/index.css")
//- 個別JSファイルの読み込み（相対パス）
block append js
  - script(src="js/index.js")

block content
```

gulpfile.js内の記述によって`pageAbsolutePath`には、そのページから見たルート相対パスが格納されています。`index.html`は`/`に置換されます。

- `/index.pug` => `/`
- `/about.pug` => `/about.html`
- `/page/index.pug` => `/page/`
- `/page/page.pug` => `/page/page.html`

`site.url`にはサイトのドメインが格納されているので、以下のように記述するとページごとの絶対パスを出力することもできます。

`#{site.url}#{pageAbsolutePath}` => 例：`http://example.com/about/`

コンテンツは`block content`の下に記述していきます。後述する`_layout.pug`でヘッダーやフッターなどの共通部分は自動で出力されます。

```
block content
  p ここから記述していきます。
```

### _template
`develop/_template/`には共通部分（`develop/_partial/`）をまとめたテンプレートが保存されています。

```
develop/
├── _template/
│   └── ja/
│       └── _default.pug
└── index.pug
```

#### _template/_default.pug
`_template/_default.pug`は各共通ファイルをインクルードするためのデフォルトテンプレートです。

```pug
block variables
include /_mixin/_all
doctype html
html(lang="ja")
  head(prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# " + pageOgpType + ": http://ogp.me/ns/" + pageOgpType + "#")
    include /_partial/ja/_meta
    include /_partial/_hreflang

  body

    include /_partial/ja/_header

    block content

    include /_partial/ja/_footer
    include /_partial/_script
```

`include /_partial/_header`などの部分がインクルードしている箇所です。必要に応じて、追加や削除をしてください。パスはルート相対パスで指定していきます。


## SSI
初期設定では共通部分はPugで管理していますが、SSIを使うこともできます。

gulpfile.jsの`browser-sync`タスクを確認してください。

```js
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      // SSIを利用する場合はmiddlewareのコメントアウトを解除します。
      // middleware: [
      //   ssi({
      //     baseDir: test.root,
      //     ext: ".html"
      //   })
      // ],
      baseDir: test.root
    },
    // 画面を共有するときにスクロールやクリックなどをミラーリングしたくない場合はfalseにします。
    ghostMode: true,
    // ローカルIPアドレスでサーバーを立ち上げます。
    open: 'external',
    // サーバー起動時に表示するページを指定します。
    // startPath: '/styleguide/',
    // falseに指定すると、サーバー起動時にポップアップを表示させません。
    notify: false
  });
});
```

5行目にあるオプションの`middleware`のコメントアウトを解除、`ext`はSSIとして機能させるファイルの拡張子です。  
Pugファイルに以下のような指定をすると、Pugから出力したHTMLファイルを表示するときにSSIを利用することができます。

```js
block content
  <!--#include virtual="/ssi/ssi.html" -->
```
