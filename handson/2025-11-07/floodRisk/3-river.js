// 水域データの読み込み(過去36年間の水の存在頻度)
var water = ee.Image('JRC/GSW1_4/GlobalSurfaceWater')
  .select('occurrence')
  .clip(roi);

// 50%以上の頻度で水が存在する場所を抽出(恒常的な河川・湖)
var permanentWater = water.gte(50).selfMask();

// 水域を青色で表示
Map.addLayer(permanentWater, {palette: ['blue']}, 'Step3: Rivers and Water Bodies', false);

print('========== ステップ3: 河川・水域データ ==========');
print('水域データの読み込み完了');
