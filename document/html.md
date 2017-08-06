# HTML
HTMLは[Pug](https://pugjs.org/api/getting-started.html)を使って生成しています。  
通常のHTMLとは構文が違いますが、共通部分などの全体の管理がしやすいところや、コーディング速度や修正がしやすいメリットがあるので採用しています。

インデントにスペースやタブが混ざるとエラーになってしまうので、.editorconfigを設定することで解決しています。お使いのエディターで.editorconfigの設定が反映されるように設定してください。

## ディレクトリ構造
Pugは`develop/`以下にある`index.pug`などがコンパイルされ、`index.html`などになります。  
`_partial/`は共通部分など、`_template/`は共通部分をまとめたテンプレート、`_data/`はサイトやページ単位で使うデータを保存します。`_index.pug`のようにアンダースコアから始まるファイルは直接出力されません。

```
develop
├── _data/ // Pugで参照できるデータ
│   └── site.json // サイト共通のデータ
├── _partial/ // 共通部分などを管理するディレクトリ
│   ├── _footer.pug
│   ├── _header.pug
│   ├── _meta.pug
│   └── _script.pug
├── _template/ // テンプレートを管理するディレクトリ
│   └── _default.pug
├── about/ // アバウトディレクトリ
│   └── index.pug
└── index.pug トップページ
```

### index.pug
ページの作成をする場合は、通常のHTMLと同じで`index.pug`や`about/index.pug`のように作成します。

`index.pug`は以下のような構成になっています。

```pug
extend /_template/_default
append variables
  //- 変更可能
  - var pageTitle= "";
  - var pageDescription= site.description;
  - var pageKeywords= site.keywords;
  //- 任意
  - var pageOgpTitle= pageTitle;
  - var pageOgpImage= site.ogpImage;
  - var pageLang= "ja";
  - var pageOgpType= "website";

//- 個別CSSファイルの読み込み（相対パス）
block append css
  //- link(rel="stylesheet" href="css/index.css")
//- 個別JSファイルの読み込み（相対パス）
block append js
  //- script(src="js/index.js")

block content
  p #{pageRootPath}
```

`append variables`以下では`var`に続く変数を変更することで出力される内容を変えることができます。

- `pageTitle`：そのページのタイトルを記述します。空にするとサイトのタイトルが、文字列を記述するとページタイトルとサイトタイトルの両方が出力されます。
- `pageDescription`：そのページの概要を記述します。初期値として`site.description`<sup>*1</sup>がセットしてあるので、サイト共通の概要が出力されます。
- `pageKeywords`：そのページのキーワードを記述します。初期値として`site.keywords`<sup>*1</sup>がセットしてあるので、サイト共通のキーワードが出力されます。
- `pageOgpTitle`：OGPで使用するタイトルを記述します。ページのタイトルと同じ場合は変数`pageTitle`を記述、違う場合は文字列で入力してください。
- `pageOgpImage`：OGPで使用する画像へのパスを、http(s)を含んだ絶対パスで記述します。サイト共通の画像を指定する場合は`site.ogpImage`のままにしておきます。
- `pageLang`：そのページ全体の言語を記述します。`<html>`タグに反映されます。
- `pageOgpType`：そのページの種類を記述します。サイトトップページは`website`、それ以外は`article`を指定します。

*1 `develop/_data/site.json`を参照してください

`block append css`と`block append js`直下のファイルの読み込みのコメントアウトを外すことで個別のCSSやJSファイルの読み込みをすることができます。

```pug
//- 個別CSSファイルの読み込み（相対パス）
block append css
  //- link(rel="stylesheet" href="css/index.css")
//- 個別JSファイルの読み込み（相対パス）
block append js
  //- script(src="js/index.js")
```

`pageRootPath`には、そのページのルート相対パスが格納されています。`index.html`は`/`に置換されています。

- `/index.pug` => `/`
- `/about.pug` => `/about.html`
- `/page/index.pug` => `/page/`
- `/page/page.pug` => `/page/page.html`

`site.rootUrl`にはサイトのドメインが格納されているので以下のように記述すると、ページごとの絶対パスを出力することができます。

`#{site.rootUrl}#{pageRootPath}`：`http://example.com/`

コンテンツは`block content`の下に記述していきます。後述する`_layout.pug`でヘッダーやフッターなどの共通部分は自動で出力されます。

```
block content
  p ここから記述していきます。
```

### _partial
`develop/_partial/`にはサイトの共通部分が保存されています。

```
develop/
├── _partial/ // 共通部分などを管理するディレクトリ
│   ├── _footer.pug
│   ├── _header.pug
│   ├── _meta.pug
│   └── _script.pug
└── index.pug トップページ
```

### _template
`develop/_template/`には共通部分をまとめたテンプレートが保存されています。

```
develop/
├── _template/ // テンプレートを管理するディレクトリ
│   └── _default.pug
└── index.pug トップページ
```

#### _default.pug
`_default.pug`は各共通ファイルをインクルードするためのファイルです。

```pug
block variables
doctype html
html(lang=pageLang)
  head(prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# " + pageOgpType + ": http://ogp.me/ns/" + pageOgpType + "#")
    include /_partial/_meta

  body

    include /_partial/_header

    block content

    include /_partial/_footer
    include /_partial/_script
```

`include /_partial/_header`などの部分がインクルードしている箇所です。必要に応じて、追加や削除をしてください。パスはルート相対パスで指定していきます。

#### _meta.pug
`_meta.pug`は`<head>`タグ内にあるメタタグをまとめて管理するためのファイルです。  
変更する可能性のある箇所が3つあります。

初期値ではページタイトルとサイトタイトルは` | `で区切られています。` - `のようにしたい場合などは変更してください。

```pug
if pageTitle
  title #{pageTitle} | #{site.name}
else
  title #{site.name}

if pageOgpTitle
  meta(property="og:title" content=pageOgpTitle + ' | ' + site.name)
else
  meta(property="og:title" content=site.name)
```

CSSを読み込んでいます。`common.css`のファイル名を変えたい場合は変更してください。

```pug
block css
  link(rel="stylesheet" href="/assets/css/common.css")
```


#### _script.pug
`_script.pug`ではJavaScriptを読み込むための記述があります。ファイル名を変えたり、読み込みファイルを増やしたい場合は変更してください。

```pug
block js
  script(src='//code.jquery.com/jquery-3.2.1.min.js', integrity='sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=', crossorigin='anonymous')
  script window.jQuery || document.write('<script src="/assets/js/jquery.min.js"><\/script>')
  script(src='//code.jquery.com/jquery-migrate-3.0.0.min.js', integrity='sha256-JklDYODbg0X+8sPiKkcFURb5z7RvlNMIaE3RA2z97vw=', crossorigin='anonymous')
  script window.jQuery || document.write('<script src="/assets/js/jquery-migrate.min.js"><\/script>')
  script(src="/assets/js/lib.js")
  script(src="/assets/js/site.js")
```

#### _header.pugや_footer.pugなど
グローバルヘッダーやグローバルフッターなどを保存するファイルがあります。変更や追加をしてください。例えば、Google Analyticsのためのファイルとして`_ga.pug`を追加してもいいでしょう。

### _data
`develop/_data/`はPugから参照できるデータを保存しています。

```js
{
  "name": "Site Name",
  "description": "Site Description",
  "keywords": "Site Keyword1, Site Keyword2",
  "rootUrl": "http://example.com",
  "ogpImage": "http://example.com/ogp.jpg"
}
```

gulpfile.jsで以下のように記述しているので、`site.name`のようにしてデータを取得することができます。

```js
  var locals = {
    // `site.hoge`でデータを取得できます。
    'site': JSON.parse(fs.readFileSync(develop.data + 'site.json'))
  };
```

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
      baseDir: test.root,
      index: "index.html"
    }
  });
});
```

5行目にあるオプションの`middleware`のコメントアウトを解除、`ext`はSSIとして機能させるファイルの拡張子です。  
Pugファイルに以下のような指定をすると、Pugから出力したHTMLファイルを表示するときにSSIを利用することができます。

```js
block content
  <!--#include virtual="/ssi/ssi.html" -->
```
