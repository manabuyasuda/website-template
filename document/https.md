# mkcertで証明書を作成する
macOSでの動作を確認しています。

homebrewから[mkcert](https://github.com/FiloSottile/mkcert)をインストールします。

```
brew install mkcert
```

Firefoxの場合はnssもインストールします。

```
brew install nss
```

ローカルに認証局を作成します。

```
mkcert -install
```

証明書を作成します。
「システム環境設定」の「ネットワーク」を開き、「詳細」ボタンをクリックします。「TCP/IP」のタブの「IPv4アドレス:」をコピーして、以下のように実行します。

```
mkcert <IPアドレス>
```

`/Users/<ユーザー名>/<IPアドレス>-key.pem`と`/Users/<ユーザー名>/<IPアドレス>.pem`が生成されます。

`.env`の`HTTPS_KEY`と`HTTPS_CERT`に証明書へのパスを設定すれば完了です。
