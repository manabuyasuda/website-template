# JavaScript
BabelとwebpackでES2015以降の書き方をES5にコンパイルしています。

## ディレクトリ構成
JavaScriptは2つ大きくわけられます。

1. site.js
2. namespace

site.jsは他のJSファイルをインポートするファイルです。`import`を使用して、各ファイルをインポートしてください。

```js
import './polyfill';
import 'what-input';

import vueTest from './vueTest';
import jsAlignHeight from './namespace/js/jsAlignHeight';
import jsSmoothScroll from './namespace/js/jsSmoothScroll';
import stBackToTop from './namespace/structure/stBackToTop';
import stBreadcrumb from './namespace/structure/stBreadcrumb';
import swDialog from './namespace/sitewide/swDialog';

vueTest();
jsAlignHeight();
jsSmoothScroll();
stBackToTop();
stBreadcrumb();
swDialog();
```

namespaceはECSSの考えをベースに使われる場所や状況ごとにディレクトリをわけて、さらにModuleごとにファイルをわけます。

```
js/
├── namespace/
│   ├── js/
│   └── data/
└── site.js
```

ファイルはすべて結合されて`htdocs/assets/js/site.js`に出力されます。

## exportとimport
処理ごとにモジュール化をして、site.jsでimportするようにしてください。  
以下は簡単な関数処理をexportする例です。

```js
// util.js
export const hello = (name) => {
  return `Hello ${name}`;
};

// site.js
import {hello} from './util';
console.log(hello('world!!'));
```

JSファイルの先頭で以下のように指定するとJQueryも使用できます。

```js
import $ from 'jquery';
```

## 環境変数
`/config/`にあるファイルで環境変数を設定できます。

```js
/**
 * 開発環境の環境変数を設定します。
 * 以下のように出力します。
 * `process.env.NODE_ENV` => 'development'
 * `process.env.API_BASE_URL` => 'dev.example.com'
 */
module.exports = {
  API_BASE_URL: 'dev.example.com',
}

```

```js
/**
 * 公開環境の環境変数を設定します。
 * 以下のように出力します。
 * `process.env.NODE_ENV` => 'production'
 * `process.env.API_BASE_URL` => 'prod.example.com'
 */
module.exports = {
  API_BASE_URL: 'prod.example.com',
}

```

以下のような記述をすべてのJSファイルで利用できます。

```js
if (process.env.NODE_ENV === 'development') {
  console.log(process.env.API_BASE_URL); // => 'dev.example.com'
} else {
  console.log(process.env.API_BASE_URL); // => 'prod.example.com'
}
```
