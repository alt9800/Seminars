# ハンズオン・デモ一覧

青山学院大学 特殊講義SI(I)「DEM（数値標高モデル）」2026年11月13日

各ページはブラウザで開くだけで動きます。手元で動かす場合は、ファイルをダブルクリックで開くとブラウザの制限でタイルが読めないことがあるため、ローカルサーバーか静的サイトのホスティングサービスを使ってください。


## 2026/11/13 講義後の追記

### [課題]

**Phase1 (Standard)**

Scaniverseを用いてご自身のスマートフォンで作成した推し地物をspzにして保存しましょう！

[Phase1の攻略法](./support1/)

[Scaniverse (Google Play)](https://play.google.com/store/apps/details?id=com.nianticlabs.scaniverse&hl=en-US) | [Scaniverse (App Store)](https://apps.apple.com/jp/app/scaniverse-3d-scanner/id1541433223)


**Phase2 (Challenge)**

spzファイルを地図上に読み込んで、適切な位置に移動させてスクショにしましょう！

[Phase2の攻略法](./support2/)

SplatのPageは[ここ(./chapter4/05-splat/)](./chapter4/05-splat/) 

上記二点を講義後の課題として課しましたが、サポートが不十分だったと思います。
アプリの使い方とファイルの保存方法、ブラウザへのアップロードなどのサポートページを作成しておきますのでご確認ください。





## 第一章 DEMとは何か、どう作られているか

| ページ | 内容 |
|---|---|
| [meshintro](./chapter1/meshintro/) | 「メッシュ」とは何か。格子に高さの値を並べたデータを見る |

## 第二章 WebGISでは高さをどのように表現するのか

| ページ | 内容 |
|---|---|
| [giscompare](./chapter2/giscompare/) | 同じ標高タイル（Mapterhorn、Terrarium形式）を MapLibre GL JS・CesiumJS・deck.gl で表示し、富士山頂を見比べる |

## 第三章 コードを読みながら、DEMにいろんなものを重ねてみよう

| ページ | 内容 | 形式 |
|---|---|---|
| [README](./chapter3/README.md) | 第三章の解説。手順と追加するコードの説明 | 資料 |
| [maplibre0](./chapter3/maplibre0/) | 地図と標高タイルを読み込む準備 | ハンズオン |
| [maplibre1](./chapter3/maplibre1/) | 陰影図を作り、地形を持ち上げる | ハンズオン |
| [maplibre2](./chapter3/maplibre2/) | 標高で色を付け、高さを強調する | ハンズオン |
| [maplibre3](./chapter3/maplibre3/) | 等高線を計算して描く | ハンズオン |
| [navara04-05](./chapter3/navara04-05/) | 水を貯める／ボールを転がし、雪を降らせる（Navara） | 実演 |

## 第四章 Webで扱えるさまざまな立体表現

| ページ | 内容 |
|---|---|
| [README](./chapter4/README.md) | 第四章の解説。各表現の仕組みとコードの説明 |
| [01-extrude](./chapter4/01-extrude/) | OpenStreetMap の建物の輪郭を押し出して立体にする |
| [02-glb](./chapter4/02-glb/) | GLB（3Dモデル）を地図に置く |
| [03-3dtiles](./chapter4/03-3dtiles/) | PLATEAU の 3D Tiles を読み込む |
| [04-pointcloud](./chapter4/04-pointcloud/) | 点群（LAS）をブラウザで読んで表示する |
| [05-splat](./chapter4/05-splat/) | Gaussian Splatting を地図に置く |