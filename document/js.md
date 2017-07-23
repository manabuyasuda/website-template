# JavaScript
JavaScriptはGulpで連結と圧縮の処理だけをしています。

## ディレクトリ構成
JavaScriptは3つ大きくわけられます。

1. jquery
2. lib
3. namespace

JQueryは`test/assets/js/`にそのまま出力されます。  
linはサイト全体で使われるライブラリやプラグインを保存します。  
namespaceはECSSの考えをベースに使われる場所や状況ごとにディレクトリをわけて、さらにModuleごとにファイルをわけます。

```
js/
├── lib/
│   ├── breakpoint.js
│   ├── debounce.js
│   ├── jquery.matchHeight-min.js
│   └── throttle.js
├── jquery.min.js
└── namespace/
```

ファイルはすべて、`test/assets/js/`に出力されます。
