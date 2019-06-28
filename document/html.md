# HTML
HTMLは[Pug](https://pugjs.org/api/getting-started.html)を使って生成しています。  
通常のHTMLとは構文が違いますが、共通部分などの全体の管理がしやすいところや、コーディング速度や修正がしやすいというメリットがあるので採用しています。

インデントにスペースやタブが混ざるとエラーになってしまうので、`.editorconfig`を設定することで解決しています。お使いのエディターで`.editorconfig`の設定が反映されるように設定してください。

初期設定では共通部分はPugで管理していますが、SSIを使うこともできます。詳しくは後述します。  
HTMLとSSIを使用しない場合は、/static/index.htmlと/static/ssiディレクトリを削除してください。

## ディレクトリ構造
Pugのコンパイルは、たとえば`src/index.pug`が`htdocs/index.html`のように生成されます。  
`_partial/`は共通部分など、`_template/`は共通部分をまとめたテンプレート、`_data/`はサイトやページ単位で使うデータ（JSON）、`_mixin/`はPugのmixinを保存します。`_index.pug`のようにアンダースコアから始まるファイルは直接出力されません。  
多言語対応のため、一部のPugファイルは`ja/`や`en/`のように言語ごとにディレクトリをわけています。

これ以降は日本語サイト用の説明をします。英語版のディレクトリもありますが、適宜読み替えてください。

```
src/
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
`src/_data/`はすべてのPugファイルから参照できるサイト共通のデータを設定しています。

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

gulpfile.jsで以下のように記述しているので、`ja.site.name`のようにしてデータを取得できます。

```js
  var locals = {
    'site': JSON.parse(fs.readFileSync(src.data + 'site.json'))
  };
  locals.ja = {
    // 日本語サイト共通のデータです。
    'site': JSON.parse(fs.readFileSync(src.data + 'ja/site.json'))
  };
```

### _partial
`src/_partial/`にはサイトの共通部分が保存されています。ディレクトリごとの共通部分も含めて、自由に追加してください。

```
src/
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
  script(src="/assets/js/lib.js")
  script(src="/assets/js/site.js")
```

#### _hreflang.pug
ドメイン内で国や言語でディレクトリをわけている場合に使います。

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
- `pageOgpImage`：OGPで使用する画像へのパスを、ルート相対パスで記述します（http(s)から始まるURLは補完されます）。サイト共通の画像を指定する場合は`ja.site.ogpImage`のままにしておきます。
- `pageOgpType`：そのページの種類を記述します。サイトトップページは`website`、それ以外は`article`を指定します。


`block append`を追加することで、ページごとに個別のCSSやJSファイルの読み込みができます。

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

コンテンツは`block content`の下に記述します。後述する`_layout.pug`でヘッダーやフッターなどの共通部分は自動で出力されます。

```
block content
  p ここから記述していきます。
```

### _template
`src/_template/`には共通部分（`src/_partial/`）をまとめたテンプレートが保存されています。

```
src/
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

`include /_partial/_header`などの部分がインクルードしている箇所です。必要に応じて、追加や削除をしてください。パスはルート相対パスで指定します。


## SSI
共通部分はSSIを使用することもできます。  
Pugを使用しない場合は、以下のディレクトリとファイルを削除してください。

- /src/_data/
- /src/_mixin/
- /src/_partial/
- /src/_template/
- /src/index.pug

HTMLファイルとSSIは/static/以下に作成します。/static/以下のファイルはすべて/htdocs/以下に複製されます。

/template/index.htmlと/template/ssi/にテンプレートを用意しています。適宜変更して使用してください。

```html
<!DOCTYPE html>
<html lang="ja">
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#">
    <!--#include virtual="/ssi/meta.html" -->
    <title>サイト名</title>
    <meta name="description" content="サイトの概要">
    <meta name="keywords" content="サイトのキーワード1, サイトのキーワード2">
    <link rel="canonical" href="https://example.com/">
    <meta property="og:title" content="サイト名">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://example.com/ogp.jpg">
    <meta property="og:url" content="https://example.com/">
    <meta property="og:description" content="サイトの概要">
    <meta property="og:site_name" content="サイト名">
    <meta property="og:locale" content="ja">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@SiteAccount">
  </head>
  <body>
    <!--#include virtual="/ssi/ja/header.html" -->

    <main>

    </main>

    <!--#include virtual="/ssi/ja/footer.html" -->

    <!--#include virtual="/ssi/script.html" -->
  </body>
</html>
```

## HTMLタグと属性
- メインコンテンツは`main`タグの中に記述します。
- ページ内に`h1`タグは1つとします。
- 見出しレベルは`h1 > section > h2 > section > h3`のように同じレベルが続かないようにします。
- リンクや画像のパスなどはルート相対パス（`/`から始めるパス）で指定します。
- width属性とheight属性省略します。
- 外部リンクは`target="_blank"`を指定します。
