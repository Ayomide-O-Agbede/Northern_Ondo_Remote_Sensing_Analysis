// ============================================================
// Northern Ondo Remote Sensing Analysis
// Script 02: NDVI and NDWI
// ============================================================

// Study area
var studyArea = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Six_LGAs'
);

Map.centerObject(studyArea, 9);
Map.addLayer(studyArea, {}, 'Northern Ondo Six LGAs');


// ------------------------------------------------------------
// Sentinel-2 cloud and shadow masking
// ------------------------------------------------------------

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


// ------------------------------------------------------------
// Sentinel-2 collection
// ------------------------------------------------------------

var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(studyArea)
  .filterDate('2025-01-01', '2025-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds);

var image = sentinel2.median().clip(studyArea);


// ------------------------------------------------------------
// NDVI
// ------------------------------------------------------------

var ndvi = image.normalizedDifference(['B8', 'B4'])
  .rename('NDVI');

Map.addLayer(
  ndvi,
  {
    min: -0.2,
    max: 0.8,
    palette: ['brown', 'yellow', 'green']
  },
  'NDVI 2025'
);


// ------------------------------------------------------------
// NDWI
// ------------------------------------------------------------

var ndwi = image.normalizedDifference(['B3', 'B8'])
  .rename('NDWI');

Map.addLayer(
  ndwi,
  {
    min: -0.5,
    max: 0.5,
    palette: ['brown', 'white', 'blue']
  },
  'NDWI 2025'
);