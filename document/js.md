# JavaScript
JavaScriptはGulpで連結と圧縮だけをしています。

## ディレクトリ構成
JavaScriptは3つ大きくわけられます。

1. jquery
2. common
3. module

JQueryは`js/`にそのまま出力されます。  
commonはサイト全体で使われるものを保存します。  
moduleはECSSの考えをベースに使われる場所や状況ごとにディレクトリをわけて、さらにModuleごとにファイルをわけます。

```
js
├── common
│   ├── breakpoint.js
│   ├── debounce.js
│   ├── jquery.matchHeight-min.js
│   └── throttle.js
├── jquery-2.2.0.min.js
└── module
```

ファイルはすべて、`test/assets/js/`に出力されます。
