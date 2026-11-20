# 第四章 Webにおけるさまざまな立体表現

スライドの順番に並べたデモの一覧です。

## 1. 押し出し(Extrude)

[ch4-maplibre.html](./ch4-maplibre.html) タブ1

OpenStreetMapの建物の輪郭を、高さの値で押し出します。

- 「押し出す」を外すと、元のフットプリントだけになります。
- 高さの倍率を変えたり、建物をクリックして使われている高さを見たりできます。

参考：[maplibre-catalog](https://alt9800.github.io/sample-maps/maplibre-catalog/)

## 2. GLBを地図に置く

[ch4-maplibre.html](./ch4-maplibre.html) タブ2

three.js を地図に重ねて、GLBを表示します。GLBには緯度経度がないので、位置・向き・大きさをこちらで決めています。

- GLBファイルを地図にドロップすると、画面の中心に置きます。
- 地図をクリックすると、その場所に移動します。大きさ・向き・高さはスライダーで変えられます。
- STLから変換したモデルが寝ているときは「Z軸が上のモデルを起こす」を使います。
- 同じフォルダに model.glb があれば最初に読み込みます。

PLATEAUの例：[pinBallPlateau](https://alt9800.github.io/markup-exp/pinBallPlateau/)

## 3. 3D Tiles

[ch4-cesium.html](./ch4-cesium.html) タブ1

PLATEAUの渋谷区の建物（3D Tiles）をCesiumJSで読み込みます。建物をクリックすると属性が見られます。

- 「東京都の一覧を取得」で、PLATEAUのAPIから他の区の tileset.json を選べます。

参考：[purupuru](https://alt9800.github.io/markup-exp/purupuru/)、[PLATEAU配信サービス API](https://docs.plateauview.mlit.go.jp/api/)

## 建物が浮いている？

[ch4-cesium.html](./ch4-cesium.html) タブ1

このページは地形を読み込んでいないので、地面は高さ0にあります。建物は「標高＋ジオイド高」の分だけ浮いて見えます。

- 建物をクリックしてから「クリックした建物を地面に合わせる」を押すと、その建物の足元が地面にそろいます。
- 「埋める」で地面より下に沈め、「そのまま（浮く）」で元に戻します。

## 4. 点群(Point Cloud)

[ch4-pointcloud.html](./ch4-pointcloud.html)

LASファイルをブラウザで読み、deck.gl で点として表示します。ヘッダに書かれた点の数や座標系も表に出します。

- 同じフォルダの pointcloud.las を最初に読み込みます。別のLASはドロップで差し替えられます。
- 色を「高さで塗り分け」にすると、形が分かりやすくなります。

## 5. Gaussian Splatting

[splat-cesium.html](./splat-cesium.html)

SPZファイルを、ブラウザの中で KHR_gaussian_splatting を使ったGLBと3D Tilesに変換し、地図に置きます。

- SPZをドロップすると表示されます。位置・向き・縮尺は右のパネルで調整します。
- 位置だけを調整するなら [splat-viewer.html](./splat-viewer.html) も使えます。

## 出典

| 対象 | 表記 |
|---|---|
| 背景地図・標高 | 地理院タイル |
| 建物（押し出し） | OpenFreeMap © OpenMapTiles Data from OpenStreetMap |
| 建物（3D Tiles） | 国土交通省 Project PLATEAU（PLATEAU配信サービス（試験運用）） |
| model.glb | Thingiverse thing:24255（作者名・作品名を記入）、GPL-2.0、STLからGLBに変換 |
| Fox（model.glb がないとき） | glTF Sample Assets。モデル PixelMannen（CC0）、リグ・アニメーション tomkranis（CC BY 4.0）、glTF変換 @AsoboStudio・@scurest（CC BY 4.0） |