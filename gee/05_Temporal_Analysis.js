// ============================================================
// Northern Ondo Remote Sensing Analysis
// Script 05: Temporal Analysis
// ============================================================

// Study area
var studyArea = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Six_LGAs'
);

Map.centerObject(studyArea, 9);
Map.addLayer(studyArea, {}, 'Northern Ondo Six LGAs');

// ------------------------------------------------------------
// Check Sentinel-2 availability in 2016
// ------------------------------------------------------------

var sentinel2016 = ee.ImageCollection(
  'COPERNICUS/S2_SR_HARMONIZED'
)
  .filterBounds(studyArea)
  .filterDate('2016-01-01', '2016-12-31');

print('Sentinel-2 images in 2016:', sentinel2016.size());


// ------------------------------------------------------------
// Sentinel-2 cloud and shadow masking
// ------------------------------------------------------------

function maskS2clouds(image) {
  var scl = image.select('SCL');

  var mask = scl.neq(3)    // Cloud shadow
    .and(scl.neq(8))       // Medium probability cloud
    .and(scl.neq(9))       // High probability cloud
    .and(scl.neq(10))      // Cirrus
    .and(scl.neq(11));     // Snow/ice

  return image.updateMask(mask)
    .copyProperties(image, ['system:time_start']);
}

// ------------------------------------------------------------
// Filter 2016 Sentinel-2 imagery
// ------------------------------------------------------------

var sentinel2016Filtered = sentinel2016
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds);

print(
  'Usable Sentinel-2 images in 2016:',
  sentinel2016Filtered.size()
);


// ------------------------------------------------------------
// Create 2016 dry-season composite
// ------------------------------------------------------------

var sentinel2016Dry = sentinel2016
  .filterDate('2016-01-01', '2016-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds);

print(
  '2016 Jan-Mar Sentinel-2 images:',
  sentinel2016Dry.size()
);


// ------------------------------------------------------------
// Create 2016 composite
// ------------------------------------------------------------

var image2016 = sentinel2016Dry
  .median()
  .clip(studyArea);

print('2016 composite:', image2016);

Map.addLayer(
  image2016,
  {
    bands: ['B4', 'B3', 'B2'],
    min: 0,
    max: 3000
  },
  'Sentinel-2 2016'
);


// ------------------------------------------------------------
// Calculate NDVI for 2016
// ------------------------------------------------------------

var ndvi2016 = image2016
  .normalizedDifference(['B8', 'B4'])
  .rename('NDVI_2016');

Map.addLayer(
  ndvi2016,
  {
    min: -0.2,
    max: 0.8,
    palette: ['brown', 'yellow', 'green']
  },
  'NDVI 2016'
);

print('NDVI 2016:', ndvi2016);


// ------------------------------------------------------------
// Calculate NDWI for 2016
// ------------------------------------------------------------

var ndwi2016 = image2016
  .normalizedDifference(['B3', 'B8'])
  .rename('NDWI_2016');

Map.addLayer(
  ndwi2016,
  {
    min: -0.5,
    max: 0.5,
    palette: ['brown', 'white', 'blue']
  },
  'NDWI 2016'
);

print('NDWI 2016:', ndwi2016);


// ------------------------------------------------------------
// Create 2025 dry-season composite
// ------------------------------------------------------------

var sentinel2025Dry = ee.ImageCollection(
  'COPERNICUS/S2_SR_HARMONIZED'
)
  .filterBounds(studyArea)
  .filterDate('2025-01-01', '2025-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds);

print(
  '2025 Jan-Mar Sentinel-2 images:',
  sentinel2025Dry.size()
);

var image2025 = sentinel2025Dry
  .median()
  .clip(studyArea);

print('2025 composite:', image2025);


// ------------------------------------------------------------
// Calculate NDVI for 2025
// ------------------------------------------------------------

var ndvi2025 = image2025
  .normalizedDifference(['B8', 'B4'])
  .rename('NDVI_2025');

Map.addLayer(
  ndvi2025,
  {
    min: -0.2,
    max: 0.8,
    palette: ['brown', 'yellow', 'green']
  },
  'NDVI 2025'
);

print('NDVI 2025:', ndvi2025);


// ------------------------------------------------------------
// Calculate NDWI for 2025
// ------------------------------------------------------------

var ndwi2025 = image2025
  .normalizedDifference(['B3', 'B8'])
  .rename('NDWI_2025');

Map.addLayer(
  ndwi2025,
  {
    min: -0.5,
    max: 0.5,
    palette: ['brown', 'white', 'blue']
  },
  'NDWI 2025'
);

print('NDWI 2025:', ndwi2025);


// ------------------------------------------------------------
// NDVI summary statistics: 2016 vs 2025
// ------------------------------------------------------------

var ndvi2016Stats = ndvi2016.reduceRegion({
  reducer: ee.Reducer.mean()
    .combine({
      reducer2: ee.Reducer.minMax(),
      sharedInputs: true
    }),
  geometry: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13
});

var ndvi2025Stats = ndvi2025.reduceRegion({
  reducer: ee.Reducer.mean()
    .combine({
      reducer2: ee.Reducer.minMax(),
      sharedInputs: true
    }),
  geometry: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13
});

print('NDVI 2016 statistics:', ndvi2016Stats);
print('NDVI 2025 statistics:', ndvi2025Stats);


// ------------------------------------------------------------
// NDWI summary statistics: 2016 vs 2025
// ------------------------------------------------------------

var ndwi2016Stats = ndwi2016.reduceRegion({
  reducer: ee.Reducer.mean()
    .combine({
      reducer2: ee.Reducer.minMax(),
      sharedInputs: true
    }),
  geometry: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13
});

var ndwi2025Stats = ndwi2025.reduceRegion({
  reducer: ee.Reducer.mean()
    .combine({
      reducer2: ee.Reducer.minMax(),
      sharedInputs: true
    }),
  geometry: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13
});

print('NDWI 2016 statistics:', ndwi2016Stats);
print('NDWI 2025 statistics:', ndwi2025Stats);


// ------------------------------------------------------------
// Calculate NDVI and NDWI change: 2025 - 2016
// ------------------------------------------------------------

var ndviChange = ndvi2025.subtract(ndvi2016)
  .rename('NDVI_Change');

var ndwiChange = ndwi2025.subtract(ndwi2016)
  .rename('NDWI_Change');


// ------------------------------------------------------------
// Display NDVI change
// ------------------------------------------------------------

Map.addLayer(
  ndviChange,
  {
    min: -0.3,
    max: 0.3,
    palette: ['red', 'white', 'green']
  },
  'NDVI Change 2016-2025'
);


// ------------------------------------------------------------
// Display NDWI change
// ------------------------------------------------------------

Map.addLayer(
  ndwiChange,
  {
    min: -0.3,
    max: 0.3,
    palette: ['brown', 'white', 'blue']
  },
  'NDWI Change 2016-2025'
);

print('NDVI change 2016-2025:', ndviChange);
print('NDWI change 2016-2025:', ndwiChange);


// ------------------------------------------------------------
// Mean NDVI and NDWI change
// ------------------------------------------------------------

var changeStats = ee.Image.cat([
  ndviChange,
  ndwiChange
]).reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: studyArea.geometry(),
  scale: 10,
  maxPixels: 1e13
});

print('Mean NDVI and NDWI change:', changeStats);


// ------------------------------------------------------------
// Area of positive and negative NDVI change
// ------------------------------------------------------------

var ndviPositive = ndviChange.gt(0);
var ndviNegative = ndviChange.lt(0);

var positiveArea = ee.Image.pixelArea()
  .updateMask(ndviPositive)
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: studyArea.geometry(),
    scale: 10,
    maxPixels: 1e13
  });

var negativeArea = ee.Image.pixelArea()
  .updateMask(ndviNegative)
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: studyArea.geometry(),
    scale: 10,
    maxPixels: 1e13
  });

print(
  'Area with NDVI increase (km²):',
  ee.Number(positiveArea.get('area')).divide(1000000)
);

print(
  'Area with NDVI decrease (km²):',
  ee.Number(negativeArea.get('area')).divide(1000000)
);


// ------------------------------------------------------------
// Area of positive and negative NDWI change
// ------------------------------------------------------------

var ndwiPositive = ndwiChange.gt(0);
var ndwiNegative = ndwiChange.lt(0);

var ndwiPositiveArea = ee.Image.pixelArea()
  .updateMask(ndwiPositive)
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: studyArea.geometry(),
    scale: 10,
    maxPixels: 1e13
  });

var ndwiNegativeArea = ee.Image.pixelArea()
  .updateMask(ndwiNegative)
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: studyArea.geometry(),
    scale: 10,
    maxPixels: 1e13
  });

print(
  'Area with NDWI increase (km²):',
  ee.Number(ndwiPositiveArea.get('area')).divide(1000000)
);

print(
  'Area with NDWI decrease (km²):',
  ee.Number(ndwiNegativeArea.get('area')).divide(1000000)
);


// ------------------------------------------------------------
// Percentage of study area with NDVI and NDWI increase/decrease
// ------------------------------------------------------------

var validArea = ee.Image.pixelArea()
  .updateMask(ndviChange.mask())
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: studyArea.geometry(),
    scale: 10,
    maxPixels: 1e13
  });

var totalValidArea = ee.Number(validArea.get('area'))
  .divide(1000000);

var ndviIncreaseKm2 = ee.Number(
  positiveArea.get('area')
).divide(1000000);

var ndviDecreaseKm2 = ee.Number(
  negativeArea.get('area')
).divide(1000000);

var ndwiIncreaseKm2 = ee.Number(
  ndwiPositiveArea.get('area')
).divide(1000000);

var ndwiDecreaseKm2 = ee.Number(
  ndwiNegativeArea.get('area')
).divide(1000000);

print('Valid analysis area (km²):', totalValidArea);

print(
  'NDVI increase (%):',
  ndviIncreaseKm2.divide(totalValidArea).multiply(100)
);

print(
  'NDVI decrease (%):',
  ndviDecreaseKm2.divide(totalValidArea).multiply(100)
);

print(
  'NDWI increase (%):',
  ndwiIncreaseKm2.divide(totalValidArea).multiply(100)
);

print(
  'NDWI decrease (%):',
  ndwiDecreaseKm2.divide(totalValidArea).multiply(100)
);


// ------------------------------------------------------------
// Check CHIRPS rainfall availability: 2016–2025
// ------------------------------------------------------------

var chirps = ee.ImageCollection(
  'UCSB-CHG/CHIRPS/DAILY'
)
  .filterBounds(studyArea)
  .filterDate('2016-01-01', '2026-01-01');

print(
  'CHIRPS images 2016–2025:',
  chirps.size()
);


// ------------------------------------------------------------
// Calculate annual rainfall totals: 2016–2025
// ------------------------------------------------------------

var years = ee.List.sequence(2016, 2025);

var annualRainfall = ee.FeatureCollection(
  years.map(function(year) {

    var start = ee.Date.fromYMD(year, 1, 1);
    var end = start.advance(1, 'year');

    var annual = chirps
      .filterDate(start, end)
      .sum()
      .rename('rainfall');

    var meanRainfall = annual.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: studyArea.geometry(),
      scale: 5566,
      maxPixels: 1e13
    });

    return ee.Feature(null, {
      year: year,
      rainfall_mm: meanRainfall.get('rainfall')
    });
  })
);

print('Annual rainfall 2016–2025:', annualRainfall);


// ------------------------------------------------------------
// Annual rainfall trend: 2016–2025
// ------------------------------------------------------------

var rainfallTrend = annualRainfall.reduceColumns({
  reducer: ee.Reducer.linearFit(),
  selectors: ['year', 'rainfall_mm']
});

print('Annual rainfall trend:', rainfallTrend);


// ------------------------------------------------------------
// Rainfall trend statistics: R² and correlation
// ------------------------------------------------------------

var rainfallCorrelation = annualRainfall.reduceColumns({
  reducer: ee.Reducer.pearsonsCorrelation(),
  selectors: ['year', 'rainfall_mm']
});

print(
  'Rainfall year-rainfall correlation:',
  rainfallCorrelation
);


// ------------------------------------------------------------
// January–March Rainfall: 2016–2025
// ------------------------------------------------------------

var seasonalRainfall = ee.FeatureCollection(
  years.map(function(year) {

    var start = ee.Date.fromYMD(year, 1, 1);
    var end = ee.Date.fromYMD(year, 4, 1);

    var seasonal = chirps
      .filterDate(start, end)
      .sum()
      .rename('rainfall');

    var meanRainfall = seasonal.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: studyArea.geometry(),
      scale: 5566,
      maxPixels: 1e13
    });

    return ee.Feature(null, {
      year: year,
      rainfall_mm: meanRainfall.get('rainfall')
    });
  })
);

print('January–March rainfall 2016–2025:', seasonalRainfall);


// ------------------------------------------------------------
// January–March Rainfall Trend: 2016–2025
// ------------------------------------------------------------

var seasonalRainfallTrend = seasonalRainfall.reduceColumns({
  reducer: ee.Reducer.linearFit(),
  selectors: ['year', 'rainfall_mm']
});

print('January–March rainfall trend:', seasonalRainfallTrend);


// ------------------------------------------------------------
// January–March Rainfall Correlation: 2016–2025
// ------------------------------------------------------------

var seasonalRainfallCorrelation = seasonalRainfall.reduceColumns({
  reducer: ee.Reducer.pearsonsCorrelation(),
  selectors: ['year', 'rainfall_mm']
});

print(
  'January–March rainfall year-rainfall correlation:',
  seasonalRainfallCorrelation
);


// ------------------------------------------------------------
// January–March Rainfall Change: 2016 vs 2025
// ------------------------------------------------------------

var rainfall2016 = ee.Number(156.84173482541632);
var rainfall2025 = ee.Number(93.82971989650278);

var rainfallDifference = rainfall2025.subtract(rainfall2016);

var rainfallPercentChange = rainfallDifference
  .divide(rainfall2016)
  .multiply(100);

print('Jan–Mar rainfall difference (2025 - 2016):', rainfallDifference);
print('Jan–Mar rainfall percentage change:', rainfallPercentChange);


// ------------------------------------------------------------
// NDVI and NDWI Mean Change: 2016 vs 2025
// ------------------------------------------------------------

var ndviMean2016 = ee.Number(0.4722929758);
var ndviMean2025 = ee.Number(0.5011978293);

var ndviDifference = ndviMean2025.subtract(ndviMean2016);

var ndviPercentChange = ndviDifference
  .divide(ndviMean2016)
  .multiply(100);

print('NDVI mean difference (2025 - 2016):', ndviDifference);
print('NDVI mean percentage change:', ndviPercentChange);


var ndwiMean2016 = ee.Number(-0.5286097850);
var ndwiMean2025 = ee.Number(-0.5501726066);

var ndwiDifference = ndwiMean2025.subtract(ndwiMean2016);

var ndwiPercentChange = ndwiDifference
  .divide(ndwiMean2016.abs())
  .multiply(100);

print('NDWI mean difference (2025 - 2016):', ndwiDifference);
print('NDWI mean percentage change:', ndwiPercentChange);


// ------------------------------------------------------------
// January–March Mean NDVI: 2016–2025
// ------------------------------------------------------------

var seasonalNDVI = ee.FeatureCollection(
  years.map(function(year) {

    var start = ee.Date.fromYMD(year, 1, 1);
    var end = ee.Date.fromYMD(year, 4, 1);

    var seasonalImage = ee.ImageCollection(
      'COPERNICUS/S2_SR_HARMONIZED'
    )
      .filterBounds(studyArea)
      .filterDate(start, end)
      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
      .map(maskS2clouds);

    var composite = seasonalImage
      .median()
      .clip(studyArea);

    var ndvi = composite
      .normalizedDifference(['B8', 'B4'])
      .rename('NDVI');

    var meanNDVI = ndvi.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: studyArea.geometry(),
      scale: 10,
      maxPixels: 1e13
    });

    return ee.Feature(null, {
      year: year,
      mean_NDVI: meanNDVI.get('NDVI')
    });
  })
);

print('January–March mean NDVI 2016–2025:', seasonalNDVI);


// ------------------------------------------------------------
// January–March Rainfall vs NDVI Correlation: 2016–2025
// ------------------------------------------------------------

var rainfallNDVI = ee.Join.inner().apply(
  seasonalRainfall,
  seasonalNDVI,
  ee.Filter.equals({
    leftField: 'year',
    rightField: 'year'
  })
);

var rainfallNDVIPairs = ee.FeatureCollection(
  rainfallNDVI.map(function(pair) {

    var rainfallFeature = ee.Feature(pair.get('primary'));
    var ndviFeature = ee.Feature(pair.get('secondary'));

    return ee.Feature(null, {
      year: rainfallFeature.get('year'),
      rainfall_mm: rainfallFeature.get('rainfall_mm'),
      mean_NDVI: ndviFeature.get('mean_NDVI')
    });
  })
);

print('Rainfall–NDVI paired data:', rainfallNDVIPairs);

var rainfallNDVICorrelation = rainfallNDVIPairs.reduceColumns({
  reducer: ee.Reducer.pearsonsCorrelation(),
  selectors: ['rainfall_mm', 'mean_NDVI']
});

print(
  'January–March rainfall vs NDVI correlation:',
  rainfallNDVICorrelation
);


// ------------------------------------------------------------
// January–March Mean NDWI: 2016–2025
// ------------------------------------------------------------

var seasonalNDWI = ee.FeatureCollection(
  years.map(function(year) {

    var start = ee.Date.fromYMD(year, 1, 1);
    var end = ee.Date.fromYMD(year, 4, 1);

    var seasonalImage = ee.ImageCollection(
      'COPERNICUS/S2_SR_HARMONIZED'
    )
      .filterBounds(studyArea)
      .filterDate(start, end)
      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
      .map(maskS2clouds);

    var composite = seasonalImage
      .median()
      .clip(studyArea);

    var ndwi = composite
      .normalizedDifference(['B3', 'B8'])
      .rename('NDWI');

    var meanNDWI = ndwi.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: studyArea.geometry(),
      scale: 10,
      maxPixels: 1e13
    });

    return ee.Feature(null, {
      year: year,
      mean_NDWI: meanNDWI.get('NDWI')
    });
  })
);

print('January–March mean NDWI 2016–2025:', seasonalNDWI);


// ------------------------------------------------------------
// January–March Rainfall vs NDWI Correlation: 2016–2025
// ------------------------------------------------------------

var rainfallNDWI = ee.Join.inner().apply(
  seasonalRainfall,
  seasonalNDWI,
  ee.Filter.equals({
    leftField: 'year',
    rightField: 'year'
  })
);

var rainfallNDWIPairs = ee.FeatureCollection(
  rainfallNDWI.map(function(pair) {

    var rainfallFeature = ee.Feature(pair.get('primary'));
    var ndwiFeature = ee.Feature(pair.get('secondary'));

    return ee.Feature(null, {
      year: rainfallFeature.get('year'),
      rainfall_mm: rainfallFeature.get('rainfall_mm'),
      mean_NDWI: ndwiFeature.get('mean_NDWI')
    });
  })
);

print('Rainfall–NDWI paired data:', rainfallNDWIPairs);

var rainfallNDWICorrelation = rainfallNDWIPairs.reduceColumns({
  reducer: ee.Reducer.pearsonsCorrelation(),
  selectors: ['rainfall_mm', 'mean_NDWI']
});

print(
  'January–March rainfall vs NDWI correlation:',
  rainfallNDWICorrelation
);


// ------------------------------------------------------------
// January–March NDVI vs NDWI Correlation: 2016–2025
// ------------------------------------------------------------

var ndviNDWI = ee.Join.inner().apply(
  seasonalNDVI,
  seasonalNDWI,
  ee.Filter.equals({
    leftField: 'year',
    rightField: 'year'
  })
);

var ndviNDWIPairs = ee.FeatureCollection(
  ndviNDWI.map(function(pair) {

    var ndviFeature = ee.Feature(pair.get('primary'));
    var ndwiFeature = ee.Feature(pair.get('secondary'));

    return ee.Feature(null, {
      year: ndviFeature.get('year'),
      mean_NDVI: ndviFeature.get('mean_NDVI'),
      mean_NDWI: ndwiFeature.get('mean_NDWI')
    });
  })
);

print('NDVI–NDWI paired data:', ndviNDWIPairs);

var ndviNDWICorrelation = ndviNDWIPairs.reduceColumns({
  reducer: ee.Reducer.pearsonsCorrelation(),
  selectors: ['mean_NDVI', 'mean_NDWI']
});

print(
  'January–March NDVI vs NDWI correlation:',
  ndviNDWICorrelation
);