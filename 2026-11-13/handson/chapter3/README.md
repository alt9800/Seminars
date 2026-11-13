# 第三章 コードを読みながら、DEMにいろんなものを重ねてみよう

一章・二章で見てきた標高データ（DEM）を、実際にWebページの上で使ってみます。材料は標高タイル1種類だけです。そこから陰影図、段彩、等高線を作り、さらに水を貯めたり、ボールを転がしたりします。

章を通して、「その計算をしているのは誰か（GPUか、CPUか）」に注目してください。

| 段階 | 内容 | エンジン | 形式 |
|---|---|---|---|
| 1 | 陰影図を作り、地形を持ち上げて回して見る | MapLibre GL JS | ハンズオン |
| 2 | 標高で色を付け、高さを強調する | MapLibre GL JS | ハンズオン |
| 3 | 等高線を計算して描く | MapLibre GL JS | ハンズオン |
| 4 | 任意の地点に水を貯める | Navara | 実演 |
| 5 | ボールを転がし、雪を降らせる | Navara | 実演 |

## ファイル

| ファイル | 内容 |
|---|---|
| `handson/step0.html` 〜 `step3.html` | ハンズオン。段階ごとに書き足していく |
| `handson/README.md` | ハンズオンの手順と、追加するコードの説明 |
| `ch3-maplibre.html` | 段階1〜3をタブで切り替えられる完成版 |
| `ch3-navara.html` | 段階4・5の実演用ページ |

どのファイルも、HTML 1枚で動きます。静的サイトのホスティングサービスにドラッグ&ドロップすると、自分のURLで開けます。ファイルをダブルクリックして開くと、ブラウザの制限でタイルが読めないことがあります。

## 材料：標高タイル

標高タイルは、見た目は画像ですが、各画素の色（R・G・B）が標高を表しています。決まった式に入れると標高に戻せます。

| 形式 | 標高の求め方 | 使っている場所 |
|---|---|---|
| Terrarium | 標高 = R × 256 + G + B ÷ 256 − 32768 | Mapterhorn（段階1〜3） |
| 国土地理院 標高PNG | x = R × 65536 + G × 256 + B。x < 2^23 なら 0.01x、x > 2^23 なら 0.01(x − 2^24)、x = 2^23 は欠損 | 地理院タイル（段階4・5） |

### Mapterhorn

Mapterhorn は、世界各地の公開されている標高データを1つにまとめ、Web地図でそのまま使える形にしたプロジェクトです。タイルは PMTiles（たくさんのタイルを1つのファイルに詰めた形式）で配布されています。ズーム12以下は全球を1ファイル、ズーム13以上は地域ごとに分けたファイルから読みます。

MapLibre は PMTiles を直接は読めないので、`addProtocol` で「`mapterhorn://z/x/y`」という独自のURLを登録し、PMTiles から該当するタイルを取り出して渡しています。

```js
maplibregl.addProtocol('mapterhorn', async (params, abortController) => {
  const [z, x, y] = params.url.replace('mapterhorn://', '').split('/').map(Number);
  const name = z <= 12 ? 'planet' : `6-${x >> (z - 6)}-${y >> (z - 6)}`;
  const file = new pmtiles.PMTiles(`${MAPTERHORN}${name}.pmtiles`);
  const tile = await file.getZxy(z, x, y, abortController.signal);
  return { data: tile.data };
});
```

## 1. 陰影図と2.5D

同じ標高タイルから、2つのものを作ります。

- `hillshade` レイヤー：となりの画素との標高差から斜面の向きと傾きを求め、光の当たり方で明暗を付けます。
- `setTerrain`：地面そのものを標高の分だけ持ち上げます。

MapLibre では、陰影を表示のたびにGPU上で計算しています。そのため、視点を動かしても軽く描けます。

```js
map.addLayer({ id: 'hillshade', type: 'hillshade', source: 'dem',
  paint: { 'hillshade-exaggeration': 0.6 } });
map.setTerrain({ source: 'terrainSrc', exaggeration: 1.5 });
```

陰影用と地形用で、同じタイルを別のソースとして登録しています。MapLibre は、1つのソースを陰影と地形の両方に使わないよう推奨しています。

## 2. 色を付ける、高さを強調する

`color-relief` レイヤーは、標高の値ごとに色を割り当てます（段彩）。MapLibre GL JS 5.6.0 で追加された機能で、色の対応表をシェーダーの中で引いています。

```js
map.addLayer({ id: 'relief', type: 'color-relief', source: 'dem',
  paint: {
    'color-relief-color': ['interpolate', ['linear'], ['elevation'],
      0, '#2c4f9e', 500, '#4fa3c7', 1500, '#f2e7a0', 2500, '#e0703a', 3776, '#a3172a']
  } }, 'hillshade');
```

`['interpolate', ['linear'], ['elevation'], 標高, 色, …]` は、「標高が0mなら青、3776mなら赤、その間はなめらかにつなぐ」という指定です。最後の `'hillshade'` は、このレイヤーを陰影の下に入れるという意味です。

`exaggeration`（強調）は、高さを何倍に見せるかの指定です。データの値は変わらず、見た目だけが変わります。

## 3. 等高線を計算する

MapLibre には等高線を作る機能がありません。そこで maplibre-contour というライブラリを使います。このライブラリは、標高タイルを読み、JavaScript で等高線を計算して、ベクタタイル（線のデータ）として MapLibre に渡します。段階1・2と違い、ここでの計算はCPUが行います。

```js
const demSource = new mlcontour.DemSource({
  url: 'mapterhorn://{z}/{x}/{y}', encoding: 'terrarium', maxzoom: 14, worker: false
});
demSource.setupMaplibre(maplibregl);

map.addSource('contours', { type: 'vector', tiles: [demSource.contourProtocolUrl({
  thresholds: { 12: [50, 250], 13: [20, 100], 14: [10, 50] },
  elevationKey: 'ele', levelKey: 'level', contourLayer: 'contours'
})] });
```

`thresholds` は「ズームレベル: [細い線の間隔, 太い線の間隔]」です。ズームするほど細かい間隔で線を引きます。

このライブラリは自分でタイルを `fetch` するため、`window.fetch` を差し替えて `mapterhorn://` のURLも読めるようにしています。通常はWeb Worker（裏側の別スレッド）で計算しますが、この差し替えを効かせるため `worker: false` にしています。

## 4. 水を貯める（実演）

クリックした地点の標高に水深を足して、水面の高さを決めます。そこから上下左右に隣の格子を調べ、「水面より低い」場所だけを順に広げていきます。画像編集ソフトの「塗りつぶし（バケツ）」と同じ考え方で、幅優先探索と呼ばれる方法です。

```js
const queue = [[c, c]];
while (queue.length) {
  const [i, j] = queue.shift();
  for (const [di, dj] of [[1,0],[-1,0],[0,1],[0,-1]]) {
    const a = i + di, b = j + dj;
    if (wet.has(`${a},${b}`) || h[a][b] >= level) continue;
    wet.add(`${a},${b}`);
    queue.push([a, b]);
  }
}
```

富士山の山頂の火口で試すと、火口の中だけに水が溜まります。斜面で試すと、水は低い方へどこまでも広がり、範囲の端に達します。

この計算は、1つの高さで水面を決めて低い場所を満たすだけで、水が流れる速さや時間の経過は扱っていません。浸水の簡単な見積もりでよく使われる考え方です。水の流れまで計算するには、格子ごとに水の量と動きを少しずつ時間を進めて計算する必要があります（浅水方程式）。格子ごとに同じ計算を繰り返す形なので、GPUが得意とする計算です。

## 5. ボールを転がし、雪を降らせる（実演）

ボールは、標高の格子を物理エンジン cannon-es の「地面」（Heightfield）として登録し、1個ずつ「落ちる・ぶつかる・転がる」を計算しています。計算はCPU（JavaScript）で行うため、数を増やすと重くなります。ボールの色は、いる場所の標高で青から赤に変わります。

雪は、Navara に組み込まれた雪の表現を使っています。粒の位置は、経過時間を入れた式からシェーダーが毎フレーム決めています。粒どうしや地面とぶつかる計算はしていないため、数万粒でも軽く描けます。雪はカメラの周りに降り、カメラと一緒に移動します。地面に積もるわけではありません。

| | ボール | 雪 |
|---|---|---|
| 計算する場所 | CPU（cannon-es） | GPU（シェーダー） |
| 数 | 数十〜数百 | 数万 |
| ぶつかる計算 | する | しない |

## Navara

Navara は Eukarya が開発している3D地図エンジンです。地理に関する計算（タイルの管理、地形のメッシュ作り、座標の変換など）を Rust / WebAssembly で行い、描画を three.js に任せる作りになっています。2026年11月10日にオープンソース版（`@navaramap/three` 0.3.1、ライセンスは MIT または Apache-2.0）が npm で公開されました。

`ch3-navara.html` では、ビルドツールを使わずに CDN（jsDelivr）から読み込んでいます。Navara は内部で Web Worker を使いますが、Worker はページと同じ場所（オリジン）からしか起動できません。そのため、ページの中で小さな Worker を作り、その中から CDN 上の Worker を読み込む処理を入れています。npm と Vite などのビルドツールを使う通常の構成では、この処理は不要です。

初回の読み込みは、WebAssembly などを含めて合計で約15MBです。

## まとめ：その計算は誰がしているか

| 段階 | 計算する場所 |
|---|---|
| 陰影・段彩 | GPU（MapLibre のシェーダー） |
| 等高線 | CPU（JavaScript） |
| 水の範囲 | CPU（JavaScript） |
| ボール | CPU（cannon-es） |
| 雪 | GPU（Navara のシェーダー） |

同じDEMを使っていても、何をどこで計算するかによって、できることと重さが変わります。

## アトリビューション

| 対象 | 表記 |
|---|---|
| 標高（段階1〜3） | [© Mapterhorn](https://mapterhorn.com/attribution)（元データごとの出典はリンク先） |
| 標高（段階4・5） | 地理院タイル（標高タイル） |
| 背景地図 | 地理院タイル（淡色地図、標準地図、全国最新写真）、© OpenStreetMap contributors（選択時） |
| 等高線の数字の文字 | MapLibre demotiles のフォント |

## 使用ライブラリ

| ライブラリ | 版 | ライセンス |
|---|---|---|
| MapLibre GL JS | 5.24.0 | BSD-3-Clause |
| PMTiles | 4.3.0 | BSD-3-Clause |
| maplibre-contour | 0.1.0 | BSD-3-Clause |
| Navara（@navaramap/three ほか） | 0.3.1 | MIT または Apache-2.0 |
| three.js | 0.186.0 | MIT |
| postprocessing | 6.39.6 | Zlib |
| cannon-es | 0.20.0 | MIT |

## 参考

- MapLibre GL JS：<https://maplibre.org/maplibre-gl-js/docs/>
- color-relief レイヤーの例：<https://maplibre.org/maplibre-gl-js/docs/examples/add-a-color-relief-layer/>
- 等高線の例：<https://maplibre.org/maplibre-gl-js/docs/examples/contour-lines/>
- Mapterhorn：<https://mapterhorn.com/>
- maplibre-contour：<https://github.com/onthegomap/maplibre-contour>
- Navara：<https://navara.world/docs/>
- 地理院タイル一覧：<https://maps.gsi.go.jp/development/ichiran.html>