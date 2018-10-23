# JavaScript
babelとbrowserifyでES2015以降の書き方をES5にトランスコンパイルしています。  
jQueryとそのプラグインなどもエンドポイントとなるsite.jsでインポートしています。

## ディレクトリ構成
JavaScriptは2つ大きくわけられます。

1. site.js
2. namespace

site.jsは他のJSファイルをインポートするファイルです。`import`を使用して、各ファイルをインポートしてください。

```js
'use strict';
import './polyfill';
import 'what-input';

import vueTest from './vue';
import jsAlignHeight from './namespace/js/alignHeight';
import jsSmoothScroll from './namespace/js/smoothScroll';
import structureBackToTop from './namespace/structure/backToTop';
import sitewideDialog from './namespace/sitewide/dialog';

vueTest();
jsAlignHeight();
jsSmoothScroll();
structureBackToTop();
sitewideDialog();
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

JSファイルの先頭で以下のように指定するとJQueryも使用することができます。

```js
import $ from 'jquery';
```

## 環境変数
`/env/`にあるファイルで環境変数を設定できます。

```js
/**
 * 環境変数を設定します。
 * npm scriptの引数によって、開発環境と公開環境で値を出し分けることができます。
 * `process.env.NODE_ENV` => 'development'
 */
exports.defaults = {
  NODE_ENV: 'development',
}
```

```
/**
 * 環境変数を設定します。
 * npm scriptの引数によって、開発環境と公開環境で値を出し分けることができます。
 * `process.env.NODE_ENV` => 'production'
 */
exports.defaults = {
  NODE_ENV: 'production',
}
```

デフォルトでは`NODE_ENV`が設定されていますが、APIやURLを開発環境と公開環境で変更したい場合は値を追加してください。  
環境変数は、`gulpfile.js`と`/src/assets/js/`以下のJSファイル内で有効です。

```js
if (process.env.NODE_ENV === 'development') {
  // テスト環境で有効な処理
}
```
