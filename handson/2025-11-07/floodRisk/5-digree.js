// 傾斜角度を計算(度単位)
var slope = ee.Terrain.slope(dem);

// 傾斜を色分けして表示(平坦=緑、急=赤)
Map.addLayer(slope, 
  {min: 0, max: 30, palette: ['green', 'yellow', 'red']}, 
  'Step5: Slope (degrees)', false);

// 平坦地(傾斜3度未満)を抽出
var flatArea = slope.lt(3).selfMask();
Map.addLayer(flatArea, {palette: ['cyan']}, 'Step5: Flat Areas (slope < 3°)', false);

// 傾斜の統計
print('========== ステップ5: 傾斜の統計 ==========');
print('傾斜の統計:', slope.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: roi,
  scale: 30,
  maxPixels: 1e9
}));
