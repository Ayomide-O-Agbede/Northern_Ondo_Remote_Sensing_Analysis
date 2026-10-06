// ============================================================
// Northern Ondo Remote Sensing Analysis
// Script 04: LULC Classification
// ============================================================

// Study area
var studyArea = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Six_LGAs'
);

Map.centerObject(studyArea, 9);
Map.addLayer(studyArea, {}, 'Northern Ondo Six LGAs');


// ------------------------------------------------------------
// Sentinel-2 preprocessing
// ------------------------------------------------------------

function maskS2clouds(image) {
  var scl = image.select('SCL');

  var mask = scl.neq(3)    // Cloud shadow
    .and(scl.neq(8))        // Medium probability cloud
    .and(scl.neq(9))        // High probability cloud
    .and(scl.neq(10))       // Cirrus
    .and(scl.neq(11));      // Snow/ice

  return image.updateMask(mask)
    .copyProperties(image, ['system:time_start']);
}

var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(studyArea)
  .filterDate('2025-01-01', '2025-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds);

print('Sentinel-2 images:', sentinel2.size());


// ------------------------------------------------------------
// Create Sentinel-2 composite
// ------------------------------------------------------------

var image = sentinel2.median().clip(studyArea);

print('Classification image:', image);

Map.addLayer(
  image,
  {
    bands: ['B4', 'B3', 'B2'],
    min: 0,
    max: 3000
  },
  'Sentinel-2 2025'
);


// ------------------------------------------------------------
// Load LULC training datasets
// ------------------------------------------------------------

var builtUp = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_BuiltUp_Training_8'
);

var cropland = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Cropland_Training'
);

var forest = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Forest_Training'
);

var shrubGrass = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_ShrubGrass_Training'
);

var bare = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_BareSparse_Training'
);

var water = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Water_Training'
);

print('Built-up training:', builtUp);
print('Cropland training:', cropland);
print('Forest training:', forest);
print('Shrub/Grassland training:', shrubGrass);
print('Bare/Sparse training:', bare);
print('Water training:', water);


// ------------------------------------------------------------
// Merge all LULC training polygons
// ------------------------------------------------------------

var trainingPolygons = builtUp
  .merge(cropland)
  .merge(forest)
  .merge(shrubGrass)
  .merge(bare)
  .merge(water);

print('Training polygons:', trainingPolygons);


// ------------------------------------------------------------
// Define predictor bands
// ------------------------------------------------------------

var predictorBands = [
  'B2',  // Blue
  'B3',  // Green
  'B4',  // Red
  'B8',  // Near Infrared
  'B11', // SWIR 1
  'B12'  // SWIR 2
];

print('Predictor bands:', predictorBands);


// ------------------------------------------------------------
// Extract training pixels from training polygons
// ------------------------------------------------------------

var samples = image.select(predictorBands).sampleRegions({
  collection: trainingPolygons,
  properties: ['class'],
  scale: 10,
  geometries: false,
  tileScale: 4
});

print('Training samples:', samples.size());


// ------------------------------------------------------------
// Split samples into training and validation sets
// ------------------------------------------------------------

var samplesRandom = samples.randomColumn('random', 42);

var training = samplesRandom.filter(
  ee.Filter.lt('random', 0.7)
);

var validation = samplesRandom.filter(
  ee.Filter.gte('random', 0.7)
);

print('Training samples:', training.size());
print('Validation samples:', validation.size());


// ------------------------------------------------------------
// Train Random Forest classifier
// ------------------------------------------------------------

var classifier = ee.Classifier.smileRandomForest({
  numberOfTrees: 100,
  seed: 42
}).train({
  features: training,
  classProperty: 'class',
  inputProperties: predictorBands
});

print('Random Forest classifier:', classifier);


// ------------------------------------------------------------
// Apply Random Forest classification
// ------------------------------------------------------------

var classified = image
  .select(predictorBands)
  .classify(classifier);

Map.addLayer(
  classified,
  {
    min: 0,
    max: 5,
    palette: [
      'red',       // 0 Built-up
      'yellow',    // 1 Cropland
      'darkgreen', // 2 Forest
      'lightgreen',// 3 Shrub/Grassland
      'brown',     // 4 Bare/Sparse
      'blue'       // 5 Water
    ]
  },
  'LULC 2025'
);

print('LULC classification:', classified);


// ------------------------------------------------------------
// Classification accuracy assessment
// ------------------------------------------------------------

var validationClassified = validation.classify(classifier);

var confusionMatrix = validationClassified.errorMatrix(
  'class',
  'classification'
);

print('Confusion Matrix:', confusionMatrix);
print('Overall Accuracy:', confusionMatrix.accuracy());
print('Kappa:', confusionMatrix.kappa());
print('Producer Accuracy:', confusionMatrix.producersAccuracy());
print('User Accuracy:', confusionMatrix.consumersAccuracy());


// ------------------------------------------------------------
// Calculate LULC area by class
// ------------------------------------------------------------

// Pixel area in square kilometres
var pixelArea = ee.Image.pixelArea().divide(1000000);

// Add pixel area and classified class
var areaImage = pixelArea.addBands(classified);

// Calculate area for each class
var classAreas = areaImage.reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1,
    groupName: 'class'
  }),
  geometry: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13
});

print('LULC class areas:', classAreas);