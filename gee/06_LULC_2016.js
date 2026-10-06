// ============================================================
// Northern Ondo Remote Sensing Analysis
// Script 06: 2016–2025 LULC Classification and Change Analysis
// ============================================================


// ============================================================
// 1. Study Area
// ============================================================

var studyArea = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Six_LGAs'
);

Map.centerObject(studyArea, 9);
Map.addLayer(studyArea, {}, 'Northern Ondo Six LGAs');


// ============================================================
// 2. Sentinel-2 Cloud Masking Function
// ============================================================

function maskS2clouds(image) {
  var scl = image.select('SCL');

  var mask = scl.neq(3)
    .and(scl.neq(8))
    .and(scl.neq(9))
    .and(scl.neq(10))
    .and(scl.neq(11));

  return image.updateMask(mask)
    .copyProperties(image, ['system:time_start']);
}


// ============================================================
// 3. Training Samples
// ============================================================

var builtUpSamples = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_BuiltUp_Training_8'
);

var croplandSamples = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Cropland_Training'
);

var forestSamples = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Forest_Training'
);

var shrubGrassSamples = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_ShrubGrass_Training'
);

var bareSparseSamples = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_BareSparse_Training'
);

var waterSamples = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Water_Training'
);

var trainingSamples = builtUpSamples
  .merge(croplandSamples)
  .merge(forestSamples)
  .merge(shrubGrassSamples)
  .merge(bareSparseSamples)
  .merge(waterSamples);

print('Total training polygons:', trainingSamples.size());


// ============================================================
// 4. Predictor Bands
// ============================================================

var predictorBands = [
  'B2',
  'B3',
  'B4',
  'B8',
  'B11',
  'B12'
];


// ============================================================
// 5. 2016 Sentinel-2 Composite
// ============================================================

var sentinel2016 = ee.ImageCollection(
  'COPERNICUS/S2_SR_HARMONIZED'
)
  .filterBounds(studyArea)
  .filterDate('2016-01-01', '2016-04-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds);

print(
  '2016 January–March Sentinel-2 images:',
  sentinel2016.size()
);

var image2016 = sentinel2016
  .median()
  .clip(studyArea);

Map.addLayer(
  image2016,
  {
    bands: ['B4', 'B3', 'B2'],
    min: 0,
    max: 3000
  },
  'Sentinel-2 2016 Jan-Mar'
);

print('2016 Sentinel-2 composite:', image2016);


// ============================================================
// 6. 2016 Training Samples
// ============================================================

var samples2016 = image2016
  .select(predictorBands)
  .sampleRegions({
    collection: trainingSamples,
    properties: ['class'],
    scale: 10,
    geometries: false,
    tileScale: 4
  });

print('2016 sampled pixels:', samples2016.size());

var samples2016Random = samples2016.randomColumn(
  'random',
  42
);

var training2016 = samples2016Random.filter(
  ee.Filter.lt('random', 0.7)
);

var validation2016 = samples2016Random.filter(
  ee.Filter.gte('random', 0.7)
);

print(
  '2016 training samples:',
  training2016.size()
);

print(
  '2016 validation samples:',
  validation2016.size()
);


// ============================================================
// 7. 2016 Random Forest Classification
// ============================================================

var classifier2016 = ee.Classifier.smileRandomForest({
  numberOfTrees: 100,
  seed: 42
}).train({
  features: training2016,
  classProperty: 'class',
  inputProperties: predictorBands
});

var classified2016 = image2016
  .select(predictorBands)
  .classify(classifier2016);

Map.addLayer(
  classified2016,
  {
    min: 0,
    max: 5,
    palette: [
      'red',
      'yellow',
      'darkgreen',
      'lightgreen',
      'brown',
      'blue'
    ]
  },
  'LULC 2016'
);

print(
  '2016 classified image:',
  classified2016
);


// ============================================================
// 8. 2016 Classification Accuracy Assessment
// ============================================================

var validated2016 = validation2016.classify(
  classifier2016
);

var confusionMatrix2016 = validated2016.errorMatrix(
  'class',
  'classification'
);

print(
  '2016 Confusion Matrix:',
  confusionMatrix2016
);

print(
  '2016 Overall Accuracy:',
  confusionMatrix2016.accuracy()
);

print(
  '2016 Kappa:',
  confusionMatrix2016.kappa()
);

print(
  '2016 Producer Accuracy:',
  confusionMatrix2016.producersAccuracy()
);

print(
  '2016 User Accuracy:',
  confusionMatrix2016.consumersAccuracy()
);


// ============================================================
// 9. 2016 LULC Area by Class
// ============================================================

var classValues = ee.List.sequence(0, 5);

var classAreas2016 = ee.FeatureCollection(
  classValues.map(function(classValue) {

    var classMask = classified2016.eq(
      ee.Number(classValue)
    );

    var area = ee.Image.pixelArea()
      .updateMask(classMask)
      .reduceRegion({
        reducer: ee.Reducer.sum(),
        geometry: studyArea.geometry(),
        scale: 10,
        maxPixels: 1e13
      });

    return ee.Feature(null, {
      class: classValue,
      area_km2: ee.Number(
        area.get('area')
      ).divide(1000000)
    });
  })
);

print(
  '2016 LULC area by class:',
  classAreas2016
);


// ============================================================
// 10. 2016 LULC Percentage by Class
// ============================================================

var totalArea2016 = classAreas2016.aggregate_sum(
  'area_km2'
);

var classPercentages2016 = classAreas2016.map(
  function(feature) {

    var percentage = ee.Number(
      feature.get('area_km2')
    )
      .divide(totalArea2016)
      .multiply(100);

    return feature.set(
      'percentage',
      percentage
    );
  }
);

print(
  '2016 LULC percentages:',
  classPercentages2016
);

print(
  '2016 total classified area (km2):',
  totalArea2016
);


// ============================================================
// 11. 2025 Sentinel-2 Composite
// ============================================================

var sentinel2025 = ee.ImageCollection(
  'COPERNICUS/S2_SR_HARMONIZED'
)
  .filterBounds(studyArea)
  .filterDate('2025-01-01', '2025-04-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds);

print(
  '2025 January–March Sentinel-2 images:',
  sentinel2025.size()
);

var image2025 = sentinel2025
  .median()
  .clip(studyArea);

Map.addLayer(
  image2025,
  {
    bands: ['B4', 'B3', 'B2'],
    min: 0,
    max: 3000
  },
  'Sentinel-2 2025 Jan-Mar'
);

print(
  '2025 Sentinel-2 composite:',
  image2025
);


// ============================================================
// 12. 2025 Training Samples
// ============================================================

var samples2025 = image2025
  .select(predictorBands)
  .sampleRegions({
    collection: trainingSamples,
    properties: ['class'],
    scale: 10,
    geometries: false,
    tileScale: 4
  });

print(
  '2025 sampled pixels:',
  samples2025.size()
);

var samples2025Random = samples2025.randomColumn(
  'random',
  42
);

var training2025 = samples2025Random.filter(
  ee.Filter.lt('random', 0.7)
);

var validation2025 = samples2025Random.filter(
  ee.Filter.gte('random', 0.7)
);

print(
  '2025 training samples:',
  training2025.size()
);

print(
  '2025 validation samples:',
  validation2025.size()
);


// ============================================================
// 13. 2025 Random Forest Classification
// ============================================================

var classifier2025 = ee.Classifier.smileRandomForest({
  numberOfTrees: 100,
  seed: 42
}).train({
  features: training2025,
  classProperty: 'class',
  inputProperties: predictorBands
});

var classified2025 = image2025
  .select(predictorBands)
  .classify(classifier2025);

Map.addLayer(
  classified2025,
  {
    min: 0,
    max: 5,
    palette: [
      'red',
      'yellow',
      'darkgreen',
      'lightgreen',
      'brown',
      'blue'
    ]
  },
  'LULC 2025'
);

print(
  '2025 classified image:',
  classified2025
);


// ============================================================
// 14. 2025 Classification Accuracy Assessment
// ============================================================

var validated2025 = validation2025.classify(
  classifier2025
);

var confusionMatrix2025 = validated2025.errorMatrix(
  'class',
  'classification'
);

print(
  '2025 Confusion Matrix:',
  confusionMatrix2025
);

print(
  '2025 Overall Accuracy:',
  confusionMatrix2025.accuracy()
);

print(
  '2025 Kappa:',
  confusionMatrix2025.kappa()
);

print(
  '2025 Producer Accuracy:',
  confusionMatrix2025.producersAccuracy()
);

print(
  '2025 User Accuracy:',
  confusionMatrix2025.consumersAccuracy()
);


// ============================================================
// 15. 2025 LULC Area by Class
// ============================================================

var classAreas2025 = ee.FeatureCollection(
  classValues.map(function(classValue) {

    var classMask = classified2025.eq(
      ee.Number(classValue)
    );

    var area = ee.Image.pixelArea()
      .updateMask(classMask)
      .reduceRegion({
        reducer: ee.Reducer.sum(),
        geometry: studyArea.geometry(),
        scale: 10,
        maxPixels: 1e13
      });

    return ee.Feature(null, {
      class: classValue,
      area_km2: ee.Number(
        area.get('area')
      ).divide(1000000)
    });
  })
);

print(
  '2025 LULC area by class:',
  classAreas2025
);


// ============================================================
// 16. 2025 LULC Percentage by Class
// ============================================================

var totalArea2025 = classAreas2025.aggregate_sum(
  'area_km2'
);

var classPercentages2025 = classAreas2025.map(
  function(feature) {

    var percentage = ee.Number(
      feature.get('area_km2')
    )
      .divide(totalArea2025)
      .multiply(100);

    return feature.set(
      'percentage',
      percentage
    );
  }
);

print(
  '2025 LULC percentages:',
  classPercentages2025
);

print(
  '2025 total classified area (km2):',
  totalArea2025
);


// ============================================================
// 17. 2016–2025 LULC Area Change
// ============================================================

var lulcChange = ee.FeatureCollection(
  classValues.map(function(classValue) {

    var area2016 = ee.Number(
      classAreas2016
        .filter(
          ee.Filter.eq('class', classValue)
        )
        .first()
        .get('area_km2')
    );

    var area2025 = ee.Number(
      classAreas2025
        .filter(
          ee.Filter.eq('class', classValue)
        )
        .first()
        .get('area_km2')
    );

    var pct2016 = ee.Number(
      classPercentages2016
        .filter(
          ee.Filter.eq('class', classValue)
        )
        .first()
        .get('percentage')
    );

    var pct2025 = ee.Number(
      classPercentages2025
        .filter(
          ee.Filter.eq('class', classValue)
        )
        .first()
        .get('percentage')
    );

    var areaChange = area2025.subtract(
      area2016
    );

    var percentagePointChange = pct2025.subtract(
      pct2016
    );

    var classNames = ee.List([
      'Built-up / Urban',
      'Cropland',
      'Forest / Woodland',
      'Shrubland / Grassland',
      'Bare / Sparse Vegetation',
      'Surface Water'
    ]);

    return ee.Feature(null, {
      class: classValue,
      class_name: classNames.get(classValue),
      area_2016: area2016,
      area_2025: area2025,
      area_change_km2: areaChange,
      pct_2016: pct2016,
      pct_2025: pct2025,
      percentage_point_change:
        percentagePointChange
    });
  })
);

print(
  '2016–2025 LULC Change:',
  lulcChange
);


// ============================================================
// 18. 2016–2025 LULC TRANSITION MATRIX
// ============================================================

var transitionCode = classified2016
  .multiply(10)
  .add(classified2025)
  .rename('transition');

var transitionArea = ee.Image.pixelArea()
  .addBands(transitionCode);

var transitionStats = transitionArea.reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1,
    groupName: 'transition'
  }),
  geometry: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13,
  tileScale: 4
});

print(
  '2016–2025 LULC Transition Areas (m²):',
  transitionStats
);


// ============================================================
// 19. CONVERT TRANSITION AREAS TO km²
// ============================================================

var transitionGroups = ee.List(
  transitionStats.get('groups')
);

var transitionTable = ee.FeatureCollection(
  transitionGroups.map(function(item) {

    item = ee.Dictionary(item);

    var code = ee.Number(item.get('transition'));
    var areaKm2 = ee.Number(item.get('sum')).divide(1e6);

    var fromClass = code.divide(10).floor();
    var toClass = code.mod(10);

    return ee.Feature(null, {
      transition: code,
      from_class: fromClass,
      to_class: toClass,
      area_km2: areaKm2
    });
  })
);

print(
  '2016–2025 LULC Transition Table (km²):',
  transitionTable
);


// ============================================================
// FINAL MAP: 2016 LULC
// ============================================================

Map.addLayer(
  classified2016,
  {
    min: 0,
    max: 5,
    palette: [
      'red',
      'yellow',
      'darkgreen',
      'lightgreen',
      'brown',
      'blue'
    ]
  },
  'FINAL — LULC 2016'
);


// ============================================================
// FINAL MAP: 2025 LULC
// ============================================================

Map.addLayer(
  classified2025,
  {
    min: 0,
    max: 5,
    palette: [
      'red',
      'yellow',
      'darkgreen',
      'lightgreen',
      'brown',
      'blue'
    ]
  },
  'FINAL — LULC 2025'
);


// ============================================================
// FINAL MAP: LULC TRANSITIONS 2016–2025
// ============================================================

var transitionMap = classified2016
  .multiply(10)
  .add(classified2025)
  .rename('LULC_Transition');

Map.addLayer(
  transitionMap,
  {
    min: 0,
    max: 55,
    palette: [
      '8B0000',
      'FF8C00',
      '228B22',
      '90EE90',
      'A52A2A',
      '0000FF'
    ]
  },
  'FINAL — LULC Transitions 2016–2025'
);


// ============================================================
// EXPORT: LULC 2016
// ============================================================

Export.image.toAsset({
  image: classified2016,
  description: 'LULC_2016',
  assetId: 'projects/northern-ondo-remote-sensing/assets/LULC_2016',
  region: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13
});


// ============================================================
// EXPORT: LULC 2025
// ============================================================

Export.image.toAsset({
  image: classified2025,
  description: 'LULC_2025',
  assetId: 'projects/northern-ondo-remote-sensing/assets/LULC_2025',
  region: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13
});


// ============================================================
// EXPORT: LULC TRANSITIONS 2016–2025
// ============================================================

Export.image.toAsset({
  image: transitionMap,
  description: 'LULC_Transitions_2016_2025',
  assetId: 'projects/northern-ondo-remote-sensing/assets/LULC_Transitions_2016_2025',
  region: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13
});