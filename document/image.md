# 画像
画像はCSSで使うものと、コンテンツに使うものを別に管理します

## ディレクトリ構成
`develop/assets/img/`に画像を保存します。CSSで使うものは`develop/assets/css/`と同じ構成で保存します。  
コンテンツ内で使う画像は、HTMLの構造に基づいて保存します。これは、CSSとJSは1つのファイルに結合されるけれど、画像は結合することができないのでパスが変わってしまうからです。

```
img
└── SiteWide
    └── Icon
        ├── FormCheckbox.svg
        ├── FormRadio.svg
        └── FormSelect.svg
```

##　命名規則
画像の命名規則は[このドキュメント](https://github.com/manabuyasuda/styleguide/blob/master/image-naming-rule.md#ファイル名のルール)をベースにします。

1. 種類（UIの大分類）
2. 詳細（どのような場面で使うのか）
3. 連番（2桁もしくは3桁）
4. 状態（ユーザーの操作やページの状態で画像を切り替える場合）

基本的に名前は省略をせず、画像の見た目が変わっても矛盾しない名前をつけてください。

パスはルート相対パスを基本とします。
