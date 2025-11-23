// 対象地域の設定(相模原市周辺)
var center = ee.Geometry.Point([139.401946, 35.566958]);
var roi = center.buffer(15000).bounds();

// 地図の中心を設定
Map.centerObject(center, 11);

// DEMデータの読み込み
var dem = ee.ImageCollection('JAXA/ALOS/AW3D30/V3_2')
  .select('DSM')  // 地表面の標高を選択
  .mosaic()       // 複数タイルを結合
  .clip(roi);     // 対象地域で切り取り

// 標高を色分けして表示
Map.addLayer(dem, 
  {min: 0, max: 100, palette: ['blue', 'green', 'yellow', 'orange', 'red']}, 
  'Elevation (m)');

// 標高の最小値・最大値を確認
print('標高の統計:', dem.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: roi,
  scale: 30,
  maxPixels: 1e9
}));