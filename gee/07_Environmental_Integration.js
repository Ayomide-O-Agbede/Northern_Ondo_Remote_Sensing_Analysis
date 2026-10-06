// ============================================================
// Northern Ondo Remote Sensing Analysis
// Script 07: Environmental Integration
// ============================================================

// Study area
var studyArea = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Six_LGAs'
);

Map.centerObject(studyArea, 9);

Map.addLayer(
  studyArea,
  {},
  'Northern Ondo Six LGAs'
);


// ============================================================
// 2016–2025 NDVI CHANGE
// January–March seasonal composites
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

// 2016 Sentinel-2
var sentinel2016 = ee.ImageCollection(
  'COPERNICUS/S2_SR_HARMONIZED'
)
  .filterBounds(studyArea)
  .filterDate('2016-01-01', '2016-04-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds);

var image2016 = sentinel2016
  .median()
  .clip(studyArea);

// 2025 Sentinel-2
var sentinel2025 = ee.ImageCollection(
  'COPERNICUS/S2_SR_HARMONIZED'
)
  .filterBounds(studyArea)
  .filterDate('2025-01-01', '2025-04-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds);

var image2025 = sentinel2025
  .median()
  .clip(studyArea);

// NDVI
var ndvi2016 = image2016
  .normalizedDifference(['B8', 'B4'])
  .rename('NDVI_2016');

var ndvi2025 = image2025
  .normalizedDifference(['B8', 'B4'])
  .rename('NDVI_2025');

// NDVI change
var ndviChange = ndvi2025
  .subtract(ndvi2016)
  .rename('NDVI_Change');

Map.addLayer(
  ndviChange,
  {
    min: -0.3,
    max: 0.3,
    palette: ['red', 'white', 'green']
  },
  'NDVI Change 2016–2025'
);


// ============================================================
// 2016–2025 NDWI CHANGE
// ============================================================

// NDWI
var ndwi2016 = image2016
  .normalizedDifference(['B3', 'B8'])
  .rename('NDWI_2016');

var ndwi2025 = image2025
  .normalizedDifference(['B3', 'B8'])
  .rename('NDWI_2025');

// NDWI change
var ndwiChange = ndwi2025
  .subtract(ndwi2016)
  .rename('NDWI_Change');

Map.addLayer(
  ndwiChange,
  {
    min: -0.3,
    max: 0.3,
    palette: ['red', 'white', 'blue']
  },
  'NDWI Change 2016–2025'
);


// ============================================================
// 2016–2025 ANNUAL RAINFALL CHANGE
// CHIRPS Daily
// ============================================================

// CHIRPS rainfall
var chirps = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
  .filterBounds(studyArea);

// 2016 annual rainfall
var rainfall2016 = chirps
  .filterDate('2016-01-01', '2017-01-01')
  .sum()
  .clip(studyArea)
  .rename('Rainfall_2016');

// 2025 annual rainfall
var rainfall2025 = chirps
  .filterDate('2025-01-01', '2026-01-01')
  .sum()
  .clip(studyArea)
  .rename('Rainfall_2025');

// Rainfall change
var rainfallChange = rainfall2025
  .subtract(rainfall2016)
  .rename('Rainfall_Change');

Map.addLayer(
  rainfallChange,
  {
    min: -500,
    max: 500,
    palette: ['red', 'white', 'blue']
  },
  'Annual Rainfall Change 2016–2025'
);


// ============================================================
// ENVIRONMENTAL CONDITIONS INDEX
// Exploratory recharge-relevant assessment
// ============================================================

// Standardize NDVI change
var ndviMean = ndviChange.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13,
  tileScale: 4
}).get('NDVI_Change');

var ndviStd = ndviChange.reduceRegion({
  reducer: ee.Reducer.stdDev(),
  geometry: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13,
  tileScale: 4
}).get('NDVI_Change');

var ndviZ = ndviChange
  .subtract(ee.Number(ndviMean))
  .divide(ee.Number(ndviStd))
  .rename('NDVI_Z');

// Standardize NDWI change
var ndwiMean = ndwiChange.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13,
  tileScale: 4
}).get('NDWI_Change');

var ndwiStd = ndwiChange.reduceRegion({
  reducer: ee.Reducer.stdDev(),
  geometry: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13,
  tileScale: 4
}).get('NDWI_Change');

var ndwiZ = ndwiChange
  .subtract(ee.Number(ndwiMean))
  .divide(ee.Number(ndwiStd))
  .rename('NDWI_Z');

// Standardize rainfall change
var rainfallMean = rainfallChange.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: studyArea.geometry(),
  scale: 5500,
  maxPixels: 1e13,
  tileScale: 4
}).get('Rainfall_Change');

var rainfallStd = rainfallChange.reduceRegion({
  reducer: ee.Reducer.stdDev(),
  geometry: studyArea.geometry(),
  scale: 5500,
  maxPixels: 1e13,
  tileScale: 4
}).get('Rainfall_Change');

var rainfallZ = rainfallChange
  .subtract(ee.Number(rainfallMean))
  .divide(ee.Number(rainfallStd))
  .rename('Rainfall_Z');

// Combined exploratory index
var environmentalIndex = ndviZ
  .add(ndwiZ)
  .add(rainfallZ)
  .divide(3)
  .rename('Environmental_Index');

Map.addLayer(
  environmentalIndex,
  {
    min: -2,
    max: 2,
    palette: ['red', 'yellow', 'green']
  },
  'Environmental Conditions Index'
);

print(
  'Environmental Conditions Index:',
  environmentalIndex
);


// ============================================================
// SUMMARY STATISTICS FOR ENVIRONMENTAL CONDITIONS INDEX
// ============================================================

var indexStats = environmentalIndex.reduceRegion({
  reducer: ee.Reducer.mean()
    .combine({
      reducer2: ee.Reducer.minMax(),
      sharedInputs: true
    }),
  geometry: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13,
  tileScale: 4
});

print(
  'Environmental Conditions Index Statistics:',
  indexStats
);


// ============================================================
// FINAL MAP 1: NDVI CHANGE 2016–2025
// ============================================================

Map.addLayer(
  ndviChange,
  {
    min: -0.3,
    max: 0.3,
    palette: ['red', 'white', 'green']
  },
  'FINAL — NDVI Change 2016–2025'
);


// ============================================================
// FINAL MAP 2: NDWI CHANGE 2016–2025
// ============================================================

Map.addLayer(
  ndwiChange,
  {
    min: -0.3,
    max: 0.3,
    palette: ['red', 'white', 'blue']
  },
  'FINAL — NDWI Change 2016–2025'
);


// ============================================================
// FINAL MAP 3: ANNUAL RAINFALL CHANGE 2016–2025
// ============================================================

Map.addLayer(
  rainfallChange,
  {
    min: -500,
    max: 500,
    palette: ['red', 'white', 'blue']
  },
  'FINAL — Annual Rainfall Change 2016–2025'
);


// ============================================================
// FINAL MAP 4: EXPLORATORY ENVIRONMENTAL CONDITIONS INDEX
// ============================================================

Map.addLayer(
  environmentalIndex,
  {
    min: -2,
    max: 2,
    palette: ['red', 'yellow', 'green']
  },
  'FINAL — Exploratory Environmental Conditions Index'
);


// ============================================================
// EXPORT: NDVI CHANGE 2016–2025
// ============================================================

Export.image.toAsset({
  image: ndviChange,
  description: 'NDVI_Change_2016_2025',
  assetId: 'projects/northern-ondo-remote-sensing/assets/NDVI_Change_2016_2025',
  region: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13
});


// ============================================================
// EXPORT: NDWI CHANGE 2016–2025
// ============================================================

Export.image.toAsset({
  image: ndwiChange,
  description: 'NDWI_Change_2016_2025',
  assetId: 'projects/northern-ondo-remote-sensing/assets/NDWI_Change_2016_2025',
  region: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13
});


// ============================================================
// EXPORT: ANNUAL RAINFALL CHANGE 2016–2025
// ============================================================

Export.image.toAsset({
  image: rainfallChange,
  description: 'Annual_Rainfall_Change_2016_2025',
  assetId: 'projects/northern-ondo-remote-sensing/assets/Annual_Rainfall_Change_2016_2025',
  region: studyArea.geometry(),
  scale: 5500,
  maxPixels: 1e13
});


// ============================================================
// EXPORT: EXPLORATORY ENVIRONMENTAL CONDITIONS INDEX
// ============================================================

Export.image.toAsset({
  image: environmentalIndex,
  description: 'Exploratory_Environmental_Conditions_Index',
  assetId: 'projects/northern-ondo-remote-sensing/assets/Exploratory_Environmental_Conditions_Index',
  region: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13
});
