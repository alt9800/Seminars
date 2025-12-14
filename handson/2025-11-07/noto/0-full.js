// =====================================
// 能登半島地震(2024年1月1日)
// Sentinel-1 SARによる地滑り検出
// =====================================

// ----- 設定 -----
var area = ee.Geometry.Rectangle([136.8, 37.2, 137.4, 37.6]);
Map.centerObject(area, 10);

// ----- データ取得 -----
var sar = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(area)
  .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
  .select('VV');

// 地震前: 2023年12月
var before = sar.filterDate('2023-12-01', '2024-01-01').median();

// 地震後: 2024年1月
var after = sar.filterDate('2024-01-01', '2024-01-31').median();

// 地形データ
var dem = ee.Image('USGS/SRTMGL1_003');
var slope = ee.Terrain.slope(dem);


// =====================================
// ステップ1: 元データの比較
// =====================================

Map.addLayer(before, 
  {min: -25, max: 0}, 
  '地震前(2023年12月)');

Map.addLayer(after, 
  {min: -25, max: 0}, 
  '地震後(2024年1月)');


// =====================================
// ステップ2: 変化量の計算
// =====================================

// SAR後方散乱の変化量(dB)
var change = after.subtract(before);

// 地滑り条件
// 1. SAR後方散乱が大きく減少(-2.5dB以下)
// 2. 急傾斜地(20度以上)
// 3. 陸地(標高50m以上)
var landslide = change.lt(-2.5)
  .and(slope.gt(20))
  .and(dem.gt(50));


// =====================================
// ステップ3: 結果の可視化
// =====================================

// 変化量マップ
Map.addLayer(change.updateMask(dem.gt(0)), 
  {min: -4, max: 4, palette: ['red', 'white', 'blue']}, 
  '変化量(赤=減少、青=増加)');

// 地滑り候補地
Map.addLayer(landslide.selfMask(), 
  {palette: ['yellow']}, 
  '地滑り候補地');

// 分析範囲
Map.addLayer(ee.Image().paint(area, 1, 2), 
  {palette: 'black'}, 
  '分析範囲');


// =====================================
// 結果サマリー
// =====================================

print('能登半島地震 地滑り検出');
print('地震前データ: 2023年12月');
print('地震後データ: 2024年1月');
print('データソース: Sentinel-1 SAR(VV偏波)');