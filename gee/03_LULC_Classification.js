// Training classes
var builtUp = ee.FeatureCollection([]);


// Study area
var studyArea = ee.FeatureCollection(
  'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Six_LGAs'
);

Map.centerObject(studyArea, 9);
Map.addLayer(studyArea, {}, 'Northern Ondo Six LGAs');


var builtUpSamples = ee.FeatureCollection(
  geometry.geometries().map(function(geom) {
    return ee.Feature(ee.Geometry(geom)).set('class', 0);
  })
);

print('Built-up samples:', builtUpSamples);


Export.table.toAsset({
  collection: builtUpSamples,
  description: 'Northern_Ondo_BuiltUp_Training',
  assetId: 'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_BuiltUp_Training'
});


var builtUpSamples = ee.FeatureCollection(
  geometry.geometries().map(function(geom) {
    return ee.Feature(ee.Geometry(geom)).set('class', 0);
  })
);

print('Built-up samples:', builtUpSamples);


Export.table.toAsset({
  collection: builtUpSamples,
  description: 'Northern_Ondo_BuiltUp_Training_8',
  assetId: 'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_BuiltUp_Training_8'
});


var croplandSamples = cropland.map(function(feature) {
  return feature.set('class', 1);
});

print('Cropland samples:', croplandSamples);


Export.table.toAsset({
  collection: croplandSamples,
  description: 'Northern_Ondo_Cropland_Training',
  assetId: 'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Cropland_Training'
});


var forestSamples = forest.map(function(feature) {
  return feature.set('class', 2);
});

print('Forest samples:', forestSamples);


Export.table.toAsset({
  collection: forestSamples,
  description: 'Northern_Ondo_Forest_Training',
  assetId: 'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Forest_Training'
});


var shrubGrassSamples = shrubGrass.map(function(feature) {
  return feature.set('class', 3);
});

print('Shrub/Grassland samples:', shrubGrassSamples);


Export.table.toAsset({
  collection: shrubGrassSamples,
  description: 'Northern_Ondo_ShrubGrass_Training',
  assetId: 'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_ShrubGrass_Training'
});


var bareSamples = bare.map(function(feature) {
  return feature.set('class', 4);
});

print('Bare/Sparse samples:', bareSamples);


Export.table.toAsset({
  collection: bareSamples,
  description: 'Northern_Ondo_BareSparse_Training',
  assetId: 'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_BareSparse_Training'
});


var waterSamples = water.map(function(feature) {
  return feature.set('class', 5);
});

print('Water samples:', waterSamples);


Export.table.toAsset({
  collection: waterSamples,
  description: 'Northern_Ondo_Water_Training',
  assetId: 'projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Water_Training'
});