// ステップ1のコードを実行した後に追加

// 標高5m未満のエリアを抽出
var lowLand5m = dem.lt(5).selfMask();

// 標高5m〜10mのエリアを抽出
var lowLand10m = dem.gte(5).and(dem.lt(10)).selfMask();

// 標高10m〜20mのエリアを抽出
var lowLand20m = dem.gte(10).and(dem.lt(20)).selfMask();

// 低地エリアを色分けして表示
Map.addLayer(lowLand20m, {palette: ['yellow']}, 'Elevation < 20m');
Map.addLayer(lowLand10m, {palette: ['orange']}, 'Elevation < 10m');
Map.addLayer(lowLand5m, {palette: ['red']}, 'Elevation < 5m');

// 標高5m未満の面積を計算
var area5m = lowLand5m.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: roi,
  scale: 30,
  maxPixels: 1e9
});

print('標高5m未満の面積 (km²):', ee.Number(area5m.get('DSM')).divide(1000000));