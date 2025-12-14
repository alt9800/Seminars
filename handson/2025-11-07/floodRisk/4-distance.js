// 水域からの距離を計算(ピクセル単位)
var waterDistancePixels = permanentWater.fastDistanceTransform().sqrt();

// ピクセル単位をメートルに変換(1ピクセル=30m)
var waterDistance = waterDistancePixels.multiply(30);

// 距離を色分けして表示(近い=青、遠い=白)
Map.addLayer(waterDistance, 
  {min: 0, max: 1000, palette: ['darkblue', 'blue', 'lightblue', 'white']}, 
  'Step4: Distance from Water (m)', false);

// 河川から100m以内のエリアを抽出
var near100m = waterDistance.lt(100).selfMask();
Map.addLayer(near100m, {palette: ['purple']}, 'Step4: Within 100m from River', false);

print('========== ステップ4: 河川からの距離 ==========');
print('河川からの距離計算完了');
