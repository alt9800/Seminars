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