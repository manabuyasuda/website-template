置換要素（`img`、`video`、`picture`、`srcset`タグなど）を親要素のサイズに応じてトリミングや拡大縮小をして表示します。

ポリフィルは「[object-fit-polyfill](https://github.com/constancecchen/object-fit-polyfill)」を使用しています。

`object-position`はvariantで変更できます（デフォルトは`50% 50%`）。
[Usage](https://github.com/constancecchen/object-fit-polyfill#usage)にもある通り、`data-object-position="center top"`のようにカスタムデータ属性でも設定が必要です。
指定順はクラス名とカスタムデータ属性値ともに`X軸 Y軸`です。

| クラス名         | X軸    | Y軸    |
| ---------------- | ------ | ------ |
| .-leftTop        | left   | top    |
| .-centerTop      | center | top    |
| `.-rightTop`     | right  | top    |
| `.-leftCenter`   | left   | center |
| `.-centerCenter` | center | center |
| `.-rightCenter`  | right  | center |
| `.-leftBottom`   | left   | bottom |
| `.-centerBottom` | center | bottom |
| `.-rightBottom`  | right  | bottom |
