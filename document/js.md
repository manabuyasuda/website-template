# JavaScript
BabelとwebpackでES2015以降の書き方をES5にコンパイルしています。

## ディレクトリ構成
JavaScriptは大きく6つにわけられます。

1. site.js
2. polyfill.js
3. /namespace
4. /domain
5. /infra
6. /utils

### site.js
JavaScriptのエントリーポイントです。`.js`と`.vue`はこのファイルで出力されます。

### polyfill.js
古いブラウザに対応するためのポリフィルをインポートします。

### /namespace
HTMLまたはPHPに紐づく処理です。
ECSSの名前空間のコンセプトを使って、使われる状況ごとにディレクトリをわけます。
ファイル名は名前空間を含めたキャメルケースです。

```js
import jsSmoothScroll from './namespace/js/jsSmoothScroll';
```

### /domain
ドメインオブジェクト。ある対象（名詞）の値を持ち・判断・加工・計算をして結果を返します。
1つの`class`にすることで、重複しがちな処理を1箇所で管理することを目的としています。

- `MediaQuery.js` メディアクエリの条件（値）を持ち、条件に一致するかを返す
- `Storage.js` ローカルストレージのキー（値）を持ち、取得・更新・削除などをする
- `History.js` URLパラメーターの取得・更新・削除などをする

### /infra
データベースや外部APIとのやり取りをします。

### /utils
1つの関数が1つの結果を返す汎用関数です。
domainと違い固有の判断や値を必要とせず、他の値を変更する副作用を起こしません。
JavaScript標準のメソッドやプロパティの組み合わせが必要な処理を、1箇所で管理することを目的としています。

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
