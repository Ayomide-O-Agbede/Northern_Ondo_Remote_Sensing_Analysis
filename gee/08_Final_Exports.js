// ============================================================
// Northern Ondo Remote Sensing Analysis
// Script 08: Final Map Exports
// ============================================================

var studyArea = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Six_LGAs'
);

// ============================================================
// EXPORT 1: LULC 2016
// ============================================================

var lulc2016 = ee.Image(
  'projects/northern-ondo-remote-sensing/assets/LULC_2016'
);

Export.image.toDrive({
  image: lulc2016,
  description: 'LULC_2016_Export',
  folder: 'GEE_Exports',
  fileNamePrefix: 'LULC_2016_Northern_Ondo',
  region: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});


// ============================================================
// EXPORT 2: LULC 2025
// ============================================================

var lulc2025 = ee.Image(
  'projects/northern-ondo-remote-sensing/assets/LULC_2025'
);

Export.image.toDrive({
  image: lulc2025,
  description: 'LULC_2025_Export',
  folder: 'GEE_Exports',
  fileNamePrefix: 'LULC_2025_Northern_Ondo',
  region: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});


// ============================================================
// EXPORT 3: LULC TRANSITIONS 2016–2025
// ============================================================

var lulcTransitions = ee.Image(
  'projects/northern-ondo-remote-sensing/assets/LULC_Transitions_2016_2025'
).toInt16();

Export.image.toDrive({
  image: lulcTransitions,
  description: 'LULC_Transitions_Export',
  folder: 'GEE_Exports',
  fileNamePrefix: 'LULC_Transitions_2016_2025_Northern_Ondo',
  region: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});


// ============================================================
// EXPORT 4: NDVI CHANGE 2016–2025
// ============================================================

var ndviChangeAsset = ee.Image(
  'projects/northern-ondo-remote-sensing/assets/NDVI_Change_2016_2025'
);

Export.image.toDrive({
  image: ndviChangeAsset,
  description: 'NDVI_Change_Export',
  folder: 'GEE_Exports',
  fileNamePrefix: 'NDVI_Change_2016_2025_Northern_Ondo',
  region: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});


// ============================================================
// EXPORT 5: NDWI CHANGE 2016–2025
// ============================================================

var ndwiChangeAsset = ee.Image(
  'projects/northern-ondo-remote-sensing/assets/NDWI_Change_2016_2025'
);

Export.image.toDrive({
  image: ndwiChangeAsset,
  description: 'NDWI_Change_Export',
  folder: 'GEE_Exports',
  fileNamePrefix: 'NDWI_Change_2016_2025_Northern_Ondo',
  region: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});


// ============================================================
// EXPORT 6: ANNUAL RAINFALL CHANGE 2016–2025
// ============================================================

var rainfallChangeAsset = ee.Image(
  'projects/northern-ondo-remote-sensing/assets/Annual_Rainfall_Change_2016_2025'
);

Export.image.toDrive({
  image: rainfallChangeAsset,
  description: 'Annual_Rainfall_Change_Export',
  folder: 'GEE_Exports',
  fileNamePrefix: 'Annual_Rainfall_Change_2016_2025_Northern_Ondo',
  region: studyArea.geometry(),
  scale: 5500,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});


// ============================================================
// EXPORT 7: EXPLORATORY ENVIRONMENTAL CONDITIONS INDEX
// ============================================================

var environmentalIndexAsset = ee.Image(
  'projects/northern-ondo-remote-sensing/assets/Exploratory_Environmental_Conditions_Index'
);

Export.image.toDrive({
  image: environmentalIndexAsset,
  description: 'Environmental_Conditions_Index_Export',
  folder: 'GEE_Exports',
  fileNamePrefix: 'Exploratory_Environmental_Conditions_Index_Northern_Ondo',
  region: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});