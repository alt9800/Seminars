---
marp: true
theme: default
header: "2025 青山学院大学特殊講義SI(1)"
footer: "2025/11/07"

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

### 2025 青山学院大学特殊講義SI(1)
# リモセンｘDEM - Google Earth Engine を使ってDEMデータを利用してみよう！

担当 : 田中聡至 (フリーランスプログラマ / OSGeo JP 運営委員)


---


知って欲しいこと : 3D地形データがどのように作られているか

---


リモートセンシングとは？


---


何に向かないか、を判断するのがお仕事になりつつあります



---

Google Earth Engineとは？


---

Google Earthとの関連


---


GEEでできること


---

データカタログ

https://developers.google.com/earth-engine/datasets?hl=ja

90ペタバイト

衛星から得られたデータ(による画像データ)と解析済みのデータを分析・可視化したデータの両方を呼び出すことが可能。

---

衛星データの種類

---

光学衛星データ

|衛星名|解像度(観測波長)|周期|提供元|
|---|---|---|---|
|Landsat|30m(可視光・近赤外)、100m(熱赤外)|16日|USGS/NASA|
|Sentinel-2|10m, 20m, 60mなど(マルチスペクトル)|5日|ESA(欧州宇宙機関)|

いつのデータか、が重要

---

SAR衛星データ

|衛星名|解像度(観測波長)|周期|提供元|
|---|---|---|---|
|Sentinel-1|10m|6-12日|ESA, EC|
|ALOS PALSAR|25m|5日|JAXA|


前者については「コペルニクス計画」とかで検索するとロマンが見えて面白いかも。


---



|データ名|解像度|解析手法|提供元|
|---|---|---|---|
|SRTM (Shuttle Radar Topography Mission)|90m (高解像度化済みデータもあり:30m)|レーダー干渉測量|USGS|
|NASA DEM|30m|ステレオ画像から生成|NASA|
|ALOS World 3D|30m|ALOS衛星のPALSAR(合成開口)レーダー干渉測量|JAXA|



---

とこのあたりの知識は詳しくはRESTECさんのサイトなどによくまとまっているので参照されたし。


---

衛星の種類


---

航空写真測量とどう違うのさ


---


DEMとDSMについて

DEMが欲しいパターン : 地形図

DSMが欲しいパターン : 建物の高さ情報をしりたい時


---

https://earthengine.google.com

視覚的に見た方が理解しやすし人はYoutubeで視聴するのも面白いかも

---


まずはログイン


---

![alt](./Assets/image1.png)


---


![alt](./Assets/image2.png)


---


![alt](./Assets/image3.png)


---


![alt](./Assets/image4.png)


---


![alt](./Assets/image5.png)



---


![alt](./Assets/image6.png)



---

![alt](./Assets/image7.png)


---


![alt](./Assets/image8.png)


---


![alt](./Assets/image9.png)



---




> いただいた回答からすると、非営利目的での Earth Engine の使用が可能です。

> 非営利団体登録の場合、お支払いプランは不要です。

> Earth Engine の構成ページで、1 日の使用量上限（EECU 時間）を作成、編集します。

---


EECU (Earth Engine Compute Unit) の割り当て


(ここら辺で請求書情報の割り当てが必要かも)

---

プロジェクトがない場合はまずは新しいプロジェクトをつくる

![alt](./Assets/image11.png)

`earthengine-project-2025-11-07`みたいな名前にする


---

実際にコードエディターを触ってみましょう！

https://code.earthengine.google.com/



![alt](./Assets/image12.png)

---


```js
console.log("Hello GEE!")

```


```js
var a=1
var b=2
var c=a+b
print(c)
```

---

<!--GEEの中でGeminiにトラブルシューティングさせてほしい-->

---

相模原市淵野辺５丁目付近のデータを見てみよう
`35.566958, 139.401946`

Google Mapsのデータとの比較もしてみる

---




Google Earth Engineで扱う画像のライセンス

---


類似サービス



VEGA

Tellus

EQ


どこから有料になるのか

---



もっと3Dで見てみたい！！

3D TilesやRGB Terrainのような形式にしてみよう！


---