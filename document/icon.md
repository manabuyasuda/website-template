# アイコン
アイコンはSVGスプライト（svgstore）を使用しています。  
以下のようなアイコンはimgタグ・背景画像・SVGスプライトを使わないsvgタグとして表示してください。

- 単色ではない
- リピート表示したい

## SVGスプライトの生成
SVGスプライトは以下の手順で生成します。

1. `src/assets/icon/`にある.svgファイルを対象にGulpのタスクが実行される。
2. `htdocs/assets/img/svg/`にSVGスプライト化された.svgファイルが出力される（デフォルトではsprite.svg）。

## アイコンの表示
装飾的なアイコンの場合は、以下のようにHTMLを記述します。

```
<svg class="icon" role="img">
  <use xlink:href="/assets/img/svg/sprite.svg#icon2"></use>
</svg>
```

アイコン自体に意味をもたせたい場合は、以下のようにHTMLを記述します。id属性が重複しないように注意します。

```
<svg class="icon" role="img" aria-labelledby="title desc">
  <title id="title">Title</title>
  <desc id="desc">Description</desc>
  <use xlink:href="/assets/img/svg/sprite.svg#icon1"></use>
</svg>
```


## スタイルの上書き
CSSは以下のように`font-size`で横幅を指定してフルードイメージのようにサイズを指定します。

```
.icon {
  position: relative;
  top: -0.1em;
  display: inline-block;
  // `width`と`height`は`font-size`に応じてサイズが変わる
  width: 1em;
  height: 1em;
  // 日本語と英語で調整が必要
  vertical-align: middle;
  // 表示したい横幅を指定する
  font-size: 1em;
  fill: currentColor;
}
```

上記の指定だと正方形のボックスができる。アイコンのアスペクト比にしたい場合は以下のように指定します。

```
.icon {
  position: relative;
  top: -0.1em;
  display: inline-block;
  width: 1em;
  // 28px * 5pxのアイコンの場合
  height: (5 / 28) * 1em;
  vertical-align: middle;
  font-size: 1em;
  fill: currentColor;
}
```
