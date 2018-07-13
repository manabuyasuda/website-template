# JavaScript
babelとbrowserifyでES2015以降の書き方をES5にトランスコンパイルしています。  
jQueryとそのプラグインなどもエンドポイントとなるsite.jsでインポートしています。

## ディレクトリ構成
JavaScriptは2つ大きくわけられます。

1. site.js
2. namespace

site.jsは他のJSファイルをインポートするファイルです。`import`を使用して、各ファイルをインポートしてください。

```js
import $ from 'jquery';
import picturefill from 'picturefill';
import focusVisible from 'focus-visible';
import jqueryMatchHeight from 'jquery-match-height';
import smoothScroll from 'smooth-scroll';

import jsAlignHeight from './namespace/js/alignHeight.js';
import jsChangeTelLink from './namespace/js/changeTelLink.js';
import jsSmoothScroll from './namespace/js/smoothScroll.js';
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
