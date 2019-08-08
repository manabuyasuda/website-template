# Component
Vue.jsの単一ファイルコンポーネント（SFC）をコンポーネントと定義します。
SFCはview（UI）とviewModel（ロジック）、そして装飾を1つのファイルで持つことができるからです。

## ディレクトリ構成
大きく2つにわけられます。

1. components.js
2. /componentName

### components.js
site.jsにインポートするため、コンポーネントを`function`としてエクスポートします。

### /componentName
コンポーネント名ごとにディレクトリを作ります。
命名規則は[Vue.jsのスタイルガイド](https://jp.vuejs.org/v2/style-guide/index.html)を基準とします。

`props`を受け取るだけのviewコンポーネント単体の場合は、viewコンポーネントがディレクトリ名になります。

```
components
└── VButton
    └── VButton.vue
```

`emit`を受け取るviewModelコンポーネントとviewコンポーネントがある場合は、viewModelコンポーネントがディレクトリ名になります。

```
components
└── TheHeader
    ├── TheHeader.vue
    ├── TheHeaderLogo.vue
    ├── TheHeaderNav.vue
    └── TheHeaderSearch.vue
```

## 中規模以上のディレクトリ構成
一定以上の規模の場合や、viewコンポーネントを再利用していろいろなViewModelコンポーネントを作りたい場合は、[large-scale-javascriptの分類](https://github.com/azu/large-scale-javascript/blob/master/docs/component.md#%E5%88%86%E9%A1%9E)を参考にしてください。
`/componentName`がprojectになり、containerとui-kitが追加されるイメージです。

```
components
├── container
│   └── index
│       └── index.vue
├── project
│   └── TheHeader
│       ├── TheHeader.vue
│       ├── TheHeaderLogo.vue
│       ├── TheHeaderNav.vue
│       └── TheHeaderSearch.vue
└── ui
    └── VButton
        └── VButton.vue
```
