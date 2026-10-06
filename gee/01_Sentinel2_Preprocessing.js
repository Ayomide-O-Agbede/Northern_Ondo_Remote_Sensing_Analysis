// ============================================================
// Northern Ondo Remote Sensing Analysis
// Script 01: Sentinel-2 Preprocessing
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

  var mask = scl.neq(3)   // Cloud shadow
    .and(scl.neq(8))       // Medium probability cloud
    .and(scl.neq(9))       // High probability cloud
    .and(scl.neq(10))      // Cirrus
    .and(scl.neq(11));     // Snow/ice

  return image.updateMask(mask)
    .copyProperties(image, ['system:time_start']);
}


// ------------------------------------------------------------
// Sentinel-2 image collection
// ------------------------------------------------------------

var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(studyArea)
  .filterDate('2025-01-01', '2025-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds);

print('Sentinel-2 images:', sentinel2.size());


// ------------------------------------------------------------
// Median composite
// ------------------------------------------------------------

var image = sentinel2.median().clip(studyArea);

Map.addLayer(
  image,
  {
    bands: ['B4', 'B3', 'B2'],
    min: 0,
    max: 3000
  },
  'Sentinel-2 2025'
);