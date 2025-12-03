---
marp: true
theme: default
header: "計画行政学会 GIS 分科会 Webプログラミングセミナー"
footer: "2025/11/23"

paginate: true

style: |
    section.title {
        justify-content: center;
        text-align: left;
    }
    .round-icon {
      position: absolute;
      top: 50px;
      right: 50px;
      width: 400px;
      height: 400px;
      border-radius: 20%;
      object-fit: cover;
      z-index: 10;
    }
    .tiny-text {
    font-size: 0.6em;  /* 通常の60%サイズ */
    }
    img {
      max-width: 100%;
      height: auto;
      image-rendering: -webkit-optimize-contrast;
    }


---


# 計画行政学会 GIS 分科会 可視化セミナー
# WebGISはじめの一歩、自分でコントロールする可視化基盤

---


## アジェンダ


- Git / Githubの説明
- Webプログラミング入門
- ソースコードの公開とは？

上記の内容(前回)を踏まえて、今回は、

# WebGISはじめの一歩、自分でコントロールする可視化基盤

についてお話しします。

---


### ~準備~

#### 必要なもの

テキストエディタ（メモ帳でもOK、VS Codeがあればベター）
ブラウザ（Chrome/Firefox/Edge など）

ホスティングをするためにサーバーが必要です。
プラグインLive-serverや`http-server`を利用できるようになると簡単です。
(インターネットに成果を公開したい場合はGitHub Pagesでホスティングするとよい)

#### ファイル作成
デスクトップなどに `handson` フォルダを作成し、その中に `leaflet`
そのなかに、`index.html` を作成してください。


---

# Leaflet編

---

## Step1 地図を表示させる

---

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Leaflet 基本の地図</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    
    <style>
        body { margin: 0; padding: 0; }
        #map { width: 100%; height: 100vh; }
    </style>
</head>
<body>
    <div id="map"></div>
    
    <!-- Leaflet JavaScript -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    
    <script>
        // 地図の初期化（東京駅中心）
        const map = L.map('map').setView([35.6812, 139.7671], 13);
        
        // 背景地図タイルの追加
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    </script>
</body>
</html>
```

---

以下にアクセス
http://localhost:8080/leaflet/

(使用するホスティングサーバによって、ポート番号が`5000`などであることも)

---

## Step 2: マーカーを追加

</script> の直前に以下を追加：


```js
// 東京駅にマーカーを追加
        const marker = L.marker([35.6812, 139.7671]).addTo(map);
        marker.bindPopup('<b>東京駅</b><br>ここが東京の中心です').openPopup();
```


---

## Step 3: 複数のマーカーを追加
```

// 東京駅にマーカーを追加
        const marker = L.marker([35.6812, 139.7671]).addTo(map);
        marker.bindPopup('<b>東京駅</b><br>ここが東京の中心です').openPopup();
```


---

## Step 4: 円を描く

```js

        // 東京駅から半径5kmの円
        L.circle([35.6812, 139.7671], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.2,
            radius: 5000
        }).addTo(map).bindPopup('東京駅から半径5km');
```

---

## Step 5: 背景地図を変更

国土地理院の地図に変更：
```js
L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
        }).addTo(map);
```

航空写真に変更：
```js
L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg', {
            attribution: '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
        }).addTo(map);
```


---

### チャレンジ

* 自分の住んでいる地域の座標に変更してみよう
* マーカーの色を変えてみよう
* 線を引いてみよう（L.polyline()）



---


Leafletを使う場合はこちらでもいい(QGISの履修が前提のため)

qgis2web — QGIS Python Plugins Repository
https://plugins.qgis.org/plugins/qgis2web/

---

- バッファーやボロノイを作る場合などは座標系の変換に注意<br>(ユークリッド距離との変換が大変)

- OpenLeyersなども利用できる


---

Leafletは書き方が変わります！！

https://leafletjs.com/2025/05/18/leaflet-2.0.0-alpha.html


---

細かいお話だと、Python(JupyterNotebookやColaboratory含む)から`foloum`や`leafmap(ipyLeaflet)`を利用して地図レイヤーを読み込む際には、
ブラウザを介してLeafletを使ってデータの可視化を行なっています。


---

# MapLibre編

---

## Step 1: 基本の地図を表示
handson/maplibre/index.html を作成し、以下をコピペ：

MapLibreではデフォルトでベクター形式の背景地図が用意されています。(Demo Tiles)


```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>MapLibre 基本の地図</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- MapLibre CSS -->
    <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" />
    
    <style>
        body { margin: 0; padding: 0; }
        #map { width: 100%; height: 100vh; }
    </style>
</head>
<body>
    <div id="map"></div>
    
    <!-- MapLibre JavaScript -->
    <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
    
    <script>
        // 地図の初期化（東京駅中心）
        const map = new maplibregl.Map({
            container: 'map',
            style: 'https://demotiles.maplibre.org/style.json',
            center: [139.7671, 35.6812],
            zoom: 13
        });
        
        // ナビゲーションコントロール（ズームボタン）を追加
        map.addControl(new maplibregl.NavigationControl());
    </script>
</body>
</html>
```

---

## Step 2: 国土地理院の地図に変更
MapLibreでは「スタイルJSON」で地図のデザインを定義します。
styleの部分を以下に置き換え：

```html
const map = new maplibregl.Map({
            container: 'map',
            style: {
                version: 8,
                sources: {
                    'gsi-std': {
                        type: 'raster',
                        tiles: [
                            'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'
                        ],
                        tileSize: 256,
                        attribution: '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
                    }
                },
                layers: [
                    {
                        id: 'gsi-std-layer',
                        type: 'raster',
                        source: 'gsi-std',
                        minzoom: 0,
                        maxzoom: 18
                    }
                ]
            },
            center: [139.7671, 35.6812],
            zoom: 13
        });
```


---

### 💡ポイント

MapLibreの最大の強みは、ベクター形式でタイルを読み込める点です。
ラスタータイルはあらかじめpngなどで矩形(メッシュ・グリッド)に分けた領域を生成しておく一方で、
ベクタータイルはクライアントサイドで地図のスタイルをある程度制御でき便利です。

■各タイルがどのように配信されているか
https://wiki.openstreetmap.org/wiki/Japan/OSMFJ_Tileserver
■ベクタータイルのスタイルを実際に見てみましょう
https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json

様々な背景レイヤを切り替える例は
maplibreSwitchの項目を参照してください。


---

## Step 3: マーカーを追加
ナビゲーションコントロールの後に追加：
```html
// 地図が読み込まれたら実行
        map.on('load', function() {
            // 東京の主要駅データ
            const stations = [
                { name: '東京駅', lng: 139.7671, lat: 35.6812 },
                { name: '新宿駅', lng: 139.7006, lat: 35.6896 },
                { name: '渋谷駅', lng: 139.7016, lat: 35.6580 },
                { name: '品川駅', lng: 139.7387, lat: 35.6284 },
                { name: '池袋駅', lng: 139.7109, lat: 35.7295 }
            ];
            
            // 各駅にマーカーを配置
            stations.forEach(function(station) {
                // ポップアップを作成
                const popup = new maplibregl.Popup({ offset: 25 })
                    .setHTML('<b>' + station.name + '</b>');
                
                // マーカーを作成
                new maplibregl.Marker()
                    .setLngLat([station.lng, station.lat])
                    .setPopup(popup)
                    .addTo(map);
            });
        });
```


---

## Step 4: 円を描く
バッファとしても利用できます。
```html
// 東京駅から半径5kmの円（地図上に張り付く）
            // 円のポイントを生成する関数
            function createCircle(center, radiusInKm, points = 64) {
                const coords = {
                    latitude: center[1],
                    longitude: center[0]
                };
                
                const km = radiusInKm;
                const ret = [];
                const distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
                const distanceY = km / 110.574;
                
                for (let i = 0; i < points; i++) {
                    const theta = (i / points) * (2 * Math.PI);
                    const x = distanceX * Math.cos(theta);
                    const y = distanceY * Math.sin(theta);
                    ret.push([coords.longitude + x, coords.latitude + y]);
                }
                ret.push(ret[0]); // 円を閉じる
                
                return ret;
            }
            
            // 円データソースを追加
            map.addSource('tokyo-circle', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [createCircle([139.7671, 35.6812], 5)]
                    }
                }
            });
            
            // 円のスタイルを追加
            map.addLayer({
                id: 'circle-fill',
                type: 'fill',
                source: 'tokyo-circle',
                paint: {
                    'fill-color': '#ff3333',
                    'fill-opacity': 0.3
                }
            });
            
            map.addLayer({
                id: 'circle-outline',
                type: 'line',
                source: 'tokyo-circle',
                paint: {
                    'line-color': '#ff0000',
                    'line-width': 2
                }
            });
```

---

ここでのヒントとして、
データソース(多くはgeojson形式)は、htmlやjsの中に記載することもできますし、
外部ファイルとして読み込むこともできます。


---

## Step 5: 3D建物を表示

```html
// 簡易的な建物データを作成（東京駅周辺の架空のビル）
            map.addSource('buildings', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            properties: {
                                name: '高層ビルA',
                                height: 150,
                                base_height: 0
                            },
                            geometry: {
                                type: 'Polygon',
                                coordinates: [[
                                    [139.765, 35.680],
                                    [139.767, 35.680],
                                    [139.767, 35.682],
                                    [139.765, 35.682],
                                    [139.765, 35.680]
                                ]]
                            }
                        },
                        {
                            type: 'Feature',
                            properties: {
                                name: '高層ビルB',
                                height: 200,
                                base_height: 0
                            },
                            geometry: {
                                type: 'Polygon',
                                coordinates: [[
                                    [139.768, 35.681],
                                    [139.770, 35.681],
                                    [139.770, 35.683],
                                    [139.768, 35.683],
                                    [139.768, 35.681]
                                ]]
                            }
                        },
                        {
                            type: 'Feature',
                            properties: {
                                name: '中層ビルC',
                                height: 80,
                                base_height: 0
                            },
                            geometry: {
                                type: 'Polygon',
                                coordinates: [[
                                    [139.764, 35.683],
                                    [139.766, 35.683],
                                    [139.766, 35.684],
                                    [139.764, 35.684],
                                    [139.764, 35.683]
                                ]]
                            }
                        }
                    ]
                }
            });
            
            // 3D建物レイヤーを追加
            map.addLayer({
                id: '3d-buildings',
                type: 'fill-extrusion',
                source: 'buildings',
                paint: {
                    'fill-extrusion-color': '#aaa',
                    'fill-extrusion-height': ['get', 'height'],
                    'fill-extrusion-base': ['get', 'base_height'],
                    'fill-extrusion-opacity': 0.8
                }
            });
```

---

これは、MapLibre GL JSのコンストラクタの引数に、`pitch`と`bearing`を追加するとみやすいかも。
```js
        const map = new maplibregl.Map({
            container: 'map',
            style: {
                // ... 省略 ...
            },
            center: [139.7671, 35.6812],
            zoom: 14,     // ズームを上げる
            pitch: 60,    // 傾きを追加
            bearing: 0
        });
```

---

### 💡オープンデータ色々
https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2024.html

```
提案1：東京23区の境界データ（ポリゴン）
javascript// 国土数値情報から取得可能
const tokyoWards = 'https://raw.githubusercontent.com/dataofjapan/land/master/tokyo23.geojson';
→ コロプレスマップ（色分け地図）を作成
提案2：東京の鉄道路線（ライン）
javascript// 国土数値情報の鉄道データ
const railwayLines = 'https://nlftp.mlit.go.jp/ksj/gml/data/N02/N02-23/N02-23_GML.zip';
→ 路線図の可視化
提案3：避難所データ（ポイント）
javascript// 国土数値情報の避難所データ
const shelters = 'https://nlftp.mlit.go.jp/ksj/gml/data/P20/P20-12/P20-12_13_GML.zip';
→ ポイントマップ、ヒートマップ
```

---

##  データ読み込みの例
maplbreLine の項目を参照
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>MapLibre 路線表示</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" />
    <style>
        body { margin: 0; padding: 0; }
        #map { width: 100%; height: 100vh; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
    <script>
        const map = new maplibregl.Map({
            container: 'map',
            style: {
                version: 8,
                sources: {
                    'gsi-pale': {
                        type: 'raster',
                        tiles: ['https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png'],
                        tileSize: 256
                    }
                },
                layers: [{
                    id: 'gsi-pale-layer',
                    type: 'raster',
                    source: 'gsi-pale'
                }]
            },
            center: [139.62, 35.67],
            zoom: 11
        });
        
        map.on('load', function() {
            fetch('../data/railway_simple.geojson')
                .then(response => response.json())
                .then(data => {
                    map.addSource('railway', {
                        type: 'geojson',
                        data: data
                    });
                    
                    map.addLayer({
                        id: 'railway-line',
                        type: 'line',
                        source: 'railway',
                        paint: {
                            'line-color': '#FF6347',
                            'line-width': 4
                        }
                    });
                });
        });
    </script>
</body>
</html>
```


---



Asahinaさんのハンズオン資料がとてもよくできていておすすめ！
https://zenn.dev/asahina820/books/c29592e397a35b


(OSGeoの私の上役ですが...)



---

# DeckGL編

---

## Step 1: 基本の地図を表示
deckglでは基本的に

```html

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Deck.gl 基本の地図</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        #map { width: 100%; height: 100vh; position: relative; }
    </style>
</head>
<body>
    <div id="map"></div>
    
    <!-- Deck.gl -->
    <script src="https://unpkg.com/deck.gl@9.0.0/dist.min.js"></script>
    
    <script>
        // 地図の初期化
        const deckgl = new deck.DeckGL({
            container: 'map',
            initialViewState: {
                longitude: 139.7671,
                latitude: 35.6812,
                zoom: 11,
                pitch: 0,
                bearing: 0
            },
            controller: true,
            layers: [
                // 背景地図タイル（OpenStreetMap）
                new deck.TileLayer({
                    id: 'osm-tiles',
                    data: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    minZoom: 0,
                    maxZoom: 19,
                    tileSize: 256,
                    renderSubLayers: props => {
                        const {
                            bbox: {west, south, east, north}
                        } = props.tile;
                        
                        return new deck.BitmapLayer(props, {
                            data: null,
                            image: props.data,
                            bounds: [west, south, east, north]
                        });
                    }
                })
            ]
        });
    </script>
</body>
</html>


```


---

## Step 2: ポイントデータを表示
主要駅をScatterplotLayerで表示します。
layers: [] の部分を以下に置き換え：
```js
              layers: [
                new deck.ScatterplotLayer({
                    id: 'stations',
                    data: [
                        { name: '東京駅', coordinates: [139.7671, 35.6812], passengers: 462000 },
                        { name: '新宿駅', coordinates: [139.7006, 35.6896], passengers: 775000 },
                        { name: '渋谷駅', coordinates: [139.7016, 35.6580], passengers: 379000 },
                        { name: '品川駅', coordinates: [139.7387, 35.6284], passengers: 379000 },
                        { name: '池袋駅', coordinates: [139.7109, 35.7295], passengers: 558000 }
                    ],
                    getPosition: d => d.coordinates,
                    getRadius: d => Math.sqrt(d.passengers) * 2,
                    getFillColor: [255, 140, 0],
                    pickable: true,
                    radiusMinPixels: 5,
                    radiusMaxPixels: 50
                })
            ]
```

---

## Step 3: ツールチップを追加

ポイントにマウスを乗せると情報を表示します。
new deck.DeckGL({ の設定に以下を追加：
```js
              getTooltip: ({object}) => object && {
                html: `<strong>${object.name}</strong><br/>乗降客数: ${object.passengers.toLocaleString()}人/日`,
                style: {
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '5px'
                }
            },
```

---

## Step 4: ヒートマップを表示
駅の密集度をヒートマップで可視化します。
layers配列に追加：

```js
                new deck.HeatmapLayer({
                    id: 'heatmap',
                    data: [
                        { coordinates: [139.7671, 35.6812], weight: 462 },
                        { coordinates: [139.7006, 35.6896], weight: 775 },
                        { coordinates: [139.7016, 35.6580], weight: 379 },
                        { coordinates: [139.7387, 35.6284], weight: 379 },
                        { coordinates: [139.7109, 35.7295], weight: 558 },
                        { coordinates: [139.7638, 35.6938], weight: 200 },
                        { coordinates: [139.7452, 35.6939], weight: 180 },
                        { coordinates: [139.6760, 35.6989], weight: 150 }
                    ],
                    getPosition: d => d.coordinates,
                    getWeight: d => d.weight,
                    radiusPixels: 60,
                    intensity: 1,
                    threshold: 0.05
                }),
```


---

## Step 5: 3D表示（ヘキサゴンレイヤー
データを3Dのヘキサゴン（六角柱）で表示します。
まず、視点を少し傾けます。initialViewState を変更：
```js
            initialViewState: {
                longitude: 139.7671,
                latitude: 35.6812,
                zoom: 11,
                pitch: 45,  // 傾き
                bearing: 0
            },
```

---

```js
                  new deck.HexagonLayer({
                    id: 'hexagon',
                    data: [
                        { coordinates: [139.7671, 35.6812], passengers: 462000 },
                        { coordinates: [139.7006, 35.6896], passengers: 775000 },
                        { coordinates: [139.7016, 35.6580], passengers: 379000 },
                        { coordinates: [139.7387, 35.6284], passengers: 379000 },
                        { coordinates: [139.7109, 35.7295], passengers: 558000 },
                        { coordinates: [139.7638, 35.6938], passengers: 200000 },
                        { coordinates: [139.7452, 35.6939], passengers: 180000 },
                        { coordinates: [139.6760, 35.6989], passengers: 150000 }
                    ],
                    getPosition: d => d.coordinates,
                    getElevationWeight: d => d.passengers,
                    elevationScale: 0.01,
                    radius: 500,
                    coverage: 0.8,
                    extruded: true,
                    pickable: true
                }),
```


---

ここまでの知識を整理すると、

可視化そのものは道具でしかなくて、その前処理としてデータをどのように整理するか、という部分で構造的なプログラミングが必要になることも多いです。
この部分もLLMに頼ると良いと思います。


---

これらの知識を踏まえて、
MapLibre と DeckGLを高度に統合し、大規模なデータを読み込むことをサポートした KeplerGLを利用するところから始めると良いでしょう。

このシステム自体もOSSなので、ご自身の管理環境にデプロイすることもできますし、背景地図をオープンなものに


---


### そのほかのTips

#### 白地図が欲しい

ナチュラルアースのデータを加工し、Geojsonとして表示し、背景レイヤーをOFFにする

あるいはSVGとして持ち、D3.jsで表示する方法もある

#### 高度な3D表現
Cesium.jsを使う方法もあります。

#### ストーリーテリング
Re:Eeathなどが便利です。


---


次回予告

福井県立大学 地域経済研究所 
青木和人先生


公共オープンデータ利活用の勘所

国や自治体からはどのようなデータが公開されていますが、どのようなプラットフォームで公開されているのか、あるいはどのような性質のデータが多いのかをあらかじめ知っておけばデータ選定の効率化が行えます。
現時点でどんなデータが出ているかを踏まえて、利活用事例についてお伝えし、
オープンデータが公開されることによる受益者をどう設定するべきか、政策立案にどのように繋げるかの糸口をこれまでの活動を通してお伝えします。

12月13日土曜日 18:00 - 
60 ~ 90 分ほどを予定しています。

場所 計画行政学会GIS研究会 Discord (https://discord.gg/aThG5Vge9g)


---