// ========================================
// 青山学院大学周辺の浸水リスクを可視化してみよう！
// ========================================

// ========================================
// Step1 地形データを読み込んで可視化してみよう！！
// ========================================

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

// ========================================
// Step2 標高を小分けにして抽出してみよう！(低地かどうかを判断したい！)
// ========================================

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

// ========================================
// Step3 水域のデータを読み込んでみよう！
// ========================================

// 水域データの読み込み(過去36年間の水の存在頻度)
var water = ee.Image('JRC/GSW1_4/GlobalSurfaceWater')
  .select('occurrence')
  .clip(roi);

// 50%以上の頻度で水が存在する場所を抽出(恒常的な河川・湖)
var permanentWater = water.gte(50).selfMask();

// 水域を青色で表示
Map.addLayer(permanentWater, {palette: ['blue']}, 'Rivers and Water Bodies');

// ========================================
// Step4 水域からの距離分析を行う
// ========================================

// 水域からの距離を計算(ピクセル単位)
var waterDistancePixels = permanentWater.fastDistanceTransform().sqrt();

// ピクセル単位をメートルに変換(1ピクセル=30m)
var waterDistance = waterDistancePixels.multiply(30);

// 距離を色分けして表示(近い=青、遠い=白)
Map.addLayer(waterDistance, 
  {min: 0, max: 1000, palette: ['darkblue', 'blue', 'lightblue', 'white']}, 
  'Distance from Water (m)');

// 河川から100m以内のエリアを抽出
var near100m = waterDistance.lt(100).selfMask();
Map.addLayer(near100m, {palette: ['purple']}, 'Within 100m from River');

// ========================================
// Step5 水捌けの良さを定量的に示したい！
// 斜面の角度をDSM(DEM)データから分析してどれくらい水が流れやすそうか見積もる。
// ========================================

// 傾斜角度を計算(度単位)
var slope = ee.Terrain.slope(dem);

// 傾斜を色分けして表示(平坦=緑、急=赤)
Map.addLayer(slope, 
  {min: 0, max: 30, palette: ['green', 'yellow', 'red']}, 
  'Slope (degrees)');

// 平坦地(傾斜3度未満)を抽出
var flatArea = slope.lt(3).selfMask();
Map.addLayer(flatArea, {palette: ['cyan']}, 'Flat Areas (slope < 3°)');

// 平坦地の統計
print('傾斜の統計:', slope.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: roi,
  scale: 30,
  maxPixels: 1e9
}));

// ========================================
// Step 6-1 評価のためのスコアリング : 標高の低さによるリスク
// ========================================

// 【要因1】標高リスク(0-3点)
var elevationRisk = ee.Image(0)
  .where(dem.lt(5), 3)              // 5m未満: 3点
  .where(dem.gte(5).and(dem.lt(10)), 2)   // 5-10m: 2点
  .where(dem.gte(10).and(dem.lt(20)), 1); // 10-20m: 1点

// 標高リスクを表示
Map.addLayer(elevationRisk.updateMask(elevationRisk.gt(0)), 
  {min: 1, max: 3, palette: ['yellow', 'orange', 'red']}, 
  'Elevation Risk');

print('標高リスクの分布を確認してください');

// ========================================
// Step 6-2 評価のためのスコアリング : 河川からの距離によるリスク
// ========================================

// 【要因2】河川距離リスク(0-3点)
var distanceRisk = ee.Image(0)
  .where(waterDistance.lt(100), 3)           // 100m未満: 3点
  .where(waterDistance.gte(100).and(waterDistance.lt(300)), 2)  // 100-300m: 2点
  .where(waterDistance.gte(300).and(waterDistance.lt(500)), 1); // 300-500m: 1点

// 河川距離リスクを表示
Map.addLayer(distanceRisk.updateMask(distanceRisk.gt(0)), 
  {min: 1, max: 3, palette: ['lightblue', 'blue', 'darkblue']}, 
  'Distance Risk');

print('河川距離リスクの分布を確認してください');

// ========================================
// Step 6-3 評価のためのスコアリング : 平坦地であることのリスク
// ========================================

// 【要因3】傾斜リスク(0-1点)
var slopeRisk = ee.Image(0).where(slope.lt(3), 1);

// 傾斜リスクを表示
Map.addLayer(slopeRisk.updateMask(slopeRisk.gt(0)), 
  {palette: ['purple']}, 
  'Slope Risk (Flat Areas)');

print('平坦地(水が溜まりやすいエリア)を確認してください');

// ========================================
// Step 6-4 リスク計算(スコアリング)
// ========================================

// 3つのリスクを合計(最大7点)
var totalRisk = elevationRisk.add(distanceRisk).add(slopeRisk);

// 総合リスクを可視化
Map.addLayer(totalRisk.updateMask(totalRisk.gt(0)), 
  {min: 1, max: 7, palette: ['lightgreen', 'yellow', 'orange', 'red', 'darkred', 'purple']}, 
  'Total Flood Risk');

// リスクレベルの説明
print('==========================================');
print('総合リスク評価:');
print('1-2点: 低リスク (light green - yellow)');
print('3-4点: 中リスク (orange)');
print('5-7点: 高リスク (red - purple)');
print('==========================================');

// ========================================
// Step 7 コンソールに計算結果を表示させる
// ========================================

// リスクレベルごとの面積を計算
var riskLevels = [1, 2, 3, 4, 5, 6, 7];

riskLevels.forEach(function(level) {
  var riskArea = totalRisk.eq(level).multiply(ee.Image.pixelArea());
  var area = riskArea.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: roi,
    scale: 30,
    maxPixels: 1e9
  });
  
  print('リスクレベル ' + level + ' の面積 (km²):', 
        ee.Number(area.get('constant')).divide(1000000));
});

print('==========================================');
print('分析完了!');
print('==========================================');