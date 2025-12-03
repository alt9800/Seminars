// 【要因1】標高リスク(0-3点)
var elevationRisk = ee.Image(0)
  .where(dem.lt(5), 3)              // 5m未満: 3点
  .where(dem.gte(5).and(dem.lt(10)), 2)   // 5-10m: 2点
  .where(dem.gte(10).and(dem.lt(20)), 1); // 10-20m: 1点

// 標高リスクを表示
Map.addLayer(elevationRisk.updateMask(elevationRisk.gt(0)), 
  {min: 1, max: 3, palette: ['yellow', 'orange', 'red']}, 
  'Step6a: Elevation Risk', false);

// 【要因2】河川距離リスク(0-3点)
var distanceRisk = ee.Image(0)
  .where(waterDistance.lt(100), 3)           // 100m未満: 3点
  .where(waterDistance.gte(100).and(waterDistance.lt(300)), 2)  // 100-300m: 2点
  .where(waterDistance.gte(300).and(waterDistance.lt(500)), 1); // 300-500m: 1点

// 河川距離リスクを表示
Map.addLayer(distanceRisk.updateMask(distanceRisk.gt(0)), 
  {min: 1, max: 3, palette: ['lightblue', 'blue', 'darkblue']}, 
  'Step6b: Distance Risk', false);

// 【要因3】傾斜リスク(0-1点)
var slopeRisk = ee.Image(0).where(slope.lt(3), 1);

// 傾斜リスクを表示
Map.addLayer(slopeRisk.updateMask(slopeRisk.gt(0)), 
  {palette: ['purple']}, 
  'Step6c: Slope Risk (Flat Areas)', false);

print('========== ステップ6-4: リスクスコアの統合 ==========');
print('標高リスク、河川距離リスク、傾斜リスクを計算完了');


// 3つのリスクを合計(最大7点)
var totalRisk = elevationRisk.add(distanceRisk).add(slopeRisk);

// 総合リスクを可視化
Map.addLayer(totalRisk.updateMask(totalRisk.gt(0)), 
  {min: 1, max: 7, palette: ['lightgreen', 'yellow', 'orange', 'red', 'darkred', 'purple']}, 
  'Step7: Total Flood Risk');

// リスクレベルの説明
print('========== ステップ6-5: 総合リスク評価 ==========');
print('総合リスク評価:');
print('1-2点: 低リスク (light green - yellow)');
print('3-4点: 中リスク (orange)');
print('5-7点: 高リスク (red - purple)');