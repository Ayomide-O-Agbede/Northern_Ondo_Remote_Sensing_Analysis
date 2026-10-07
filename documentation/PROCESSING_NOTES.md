# Processing Notes

## 1. Purpose

This document records the main processing decisions, corrections, export details and reproducibility notes for the **Remote-Sensing Assessment of Environmental Conditions Relevant to Groundwater Recharge in Northern Ondo State, Nigeria**.

The project was processed using **Google Earth Engine and QGIS**.

---

## 2. Google Earth Engine Project

The analysis was conducted under the Google Earth Engine Cloud project:

`northern-ondo-remote-sensing`

The study-area boundary was stored as:

`projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Six_LGAs`

The six LGA features were retained individually rather than dissolved into one polygon for the main analytical workflow.

---

## 3. Sentinel-2 Processing

Sentinel-2 Surface Reflectance Harmonized imagery was obtained from:

`COPERNICUS/S2_SR_HARMONIZED`

The main workflow was:

1. Filter imagery to the six-LGA study area.
2. Exclude scenes with cloudy-pixel percentage of 20% or greater.
3. Mask unwanted pixels using the Scene Classification Layer.
4. Generate median composites.
5. Clip the composites to the study area.

The following SCL classes were masked:

* 3 — Cloud shadow
* 8 — Cloud medium probability
* 9 — Cloud high probability
* 10 — Thin cirrus
* 11 — Snow/ice

The main seasonal analysis used the **January–March window** for consistency across years.

---

## 4. LULC Training Data

Six LULC classes were used:

```text
0 — Built-up / Urban
1 — Cropland
2 — Forest / Woodland
3 — Shrubland / Grassland
4 — Bare / Sparse Vegetation
5 — Surface Water
```

The final training dataset contained **44 polygons**:

```text
Built-up              8 polygons
Cropland               8 polygons
Forest                 8 polygons
Shrub/Grassland        8 polygons
Bare/Sparse            8 polygons
Surface Water          4 polygons
```

The four water polygons were retained because they represented the clearest identifiable surface-water areas available during the training process.

---

## 5. LULC Classification

The Random Forest classification used:

* Predictor bands: B2, B3, B4, B8, B11 and B12
* Number of trees: 100
* Random seed: 42
* Training/validation split: 70% / 30%

Separate classifications were produced for 2016 and 2025 using the same classification framework and training polygons.

This approach allowed the two years to be compared using the same six-class scheme.

---

## 6. 2025 Classification Correction

An earlier 2025 classification produced an overall accuracy of approximately **91.98%**.

This result was not retained for the final change analysis.

The final workflow classified both 2016 and 2025 using the same Random Forest framework. The final 2025 classification produced:

* Overall Accuracy: **89.41%**
* Kappa: **0.869**

Therefore, **89.41%** is the final 2025 accuracy value used in the project.

---

## 7. Final Classification Accuracy

The final accuracy results are:

```text
2016:
Overall Accuracy = 92.60%
Kappa = 0.902

2025:
Overall Accuracy = 89.41%
Kappa = 0.869
```

The validation samples were derived from the manually delineated training regions.

Therefore, the results should not be described as independent field validation.

---

## 8. LULC Area Calculation

Classified pixels were converted to area using pixel-area calculations in Google Earth Engine.

Areas were converted from square metres to square kilometres.

The 2016 and 2025 classified rasters had slightly different total valid classified areas because of differences in valid pixels between the independently processed images.

The final total classified areas were approximately:

```text
2016 = 4192.97 km²
2025 = 4188.25 km²
```

This difference is due to valid-pixel availability and does not represent an actual change in the study-area boundary.

---

## 9. LULC Transition Coding

LULC transitions were encoded using:

**Transition Code = (2016 Class × 10) + 2025 Class**

Examples:

```text
12 = Cropland → Forest
13 = Cropland → Shrubland/Grassland
21 = Forest → Cropland
23 = Forest → Shrubland/Grassland
31 = Shrubland/Grassland → Cropland
43 = Bare/Sparse Vegetation → Shrubland/Grassland
```

Stable classes include:

```text
00 = Built-up → Built-up
11 = Cropland → Cropland
22 = Forest → Forest
33 = Shrubland/Grassland → Shrubland/Grassland
44 = Bare/Sparse → Bare/Sparse
55 = Surface Water → Surface Water
```

The transition analysis used pixels with valid classifications in both years.

---

## 10. Transition Export Correction

The initial LULC transition raster was represented as a **Long** integer image type.

A Google Earth Engine export to Drive failed with:

**“Pixel type not supported: Type<Long>.”**

The export was corrected by converting the transition raster to a supported integer type:

```javascript
var lulcTransitions = ee.Image(
  'projects/northern-ondo-remote-sensing/assets/LULC_Transitions_2016_2025'
).toInt16();
```

The corrected transition raster was then successfully exported.

This correction changed the export data type only. It did not change the transition codes or calculated transition areas.

---

## 11. NDVI Processing

NDVI was calculated using:

```text
NDVI = (B8 − B4) / (B8 + B4)
```

where:

* B8 = Near Infrared
* B4 = Red

January–March composites were used to calculate annual mean NDVI values for 2016–2025.

NDVI change was calculated as:

```text
NDVI Change = NDVI 2025 − NDVI 2016
```

Positive values represent an increase in vegetation spectral response.

---

## 12. NDWI Processing

NDWI was calculated using:

```text
NDWI = (B3 − B8) / (B3 + B8)
```

where:

* B3 = Green
* B8 = Near Infrared

January–March composites were used to calculate annual mean NDWI values.

NDWI change was calculated as:

```text
NDWI Change = NDWI 2025 − NDWI 2016
```

NDWI was interpreted as a water/moisture spectral indicator rather than a direct measurement of water volume or groundwater recharge.

---

## 13. CHIRPS Rainfall Processing

CHIRPS precipitation data were processed for the six-LGA study area.

Two temporal measures were generated:

* Annual rainfall totals
* January–March rainfall totals

Annual rainfall change was calculated as:

```text
Rainfall Change = Rainfall 2025 − Rainfall 2016
```

CHIRPS has an approximate spatial resolution of **5.5 km**. The rainfall product was therefore retained at its native analytical scale rather than resampled to 10 m.

---

## 14. Rainfall Trend Analysis

Annual rainfall showed a fitted linear trend of:

**+4.43 mm/year**

with:

* r = 0.091
* p = 0.802

January–March rainfall showed a fitted trend of:

**−2.38 mm/year**

with:

* r = −0.197
* p = 0.586

Neither trend was statistically significant.

---

## 15. Correlation Analysis

Pearson correlation was used for exploratory analysis of the ten-year annual series.

Results:

```text
January–March rainfall vs NDVI
r = 0.040
p = 0.913

January–March rainfall vs NDWI
r = 0.042
p = 0.909

January–March NDVI vs NDWI
r = −0.917
p < 0.001
```

The correlations describe statistical associations and should not be interpreted as causal relationships.

---

## 16. Environmental Conditions Index

The Exploratory Environmental Conditions Index was created by standardizing:

* NDVI change
* NDWI change
* Annual rainfall change

The standardized layers were averaged with equal weighting.

The index was intentionally labelled **Exploratory Environmental Conditions Index**.

It was not presented as:

* groundwater recharge rate
* groundwater recharge potential
* groundwater storage
* aquifer productivity

The purpose was to provide a relative spatial synthesis of environmental changes relevant to groundwater-recharge conditions.

---

## 17. Permanent Google Earth Engine Assets

The final derived products were stored in Google Earth Engine as:

```text
projects/northern-ondo-remote-sensing/assets/LULC_2016

projects/northern-ondo-remote-sensing/assets/LULC_2025

projects/northern-ondo-remote-sensing/assets/LULC_Transitions_2016_2025

projects/northern-ondo-remote-sensing/assets/NDVI_Change_2016_2025

projects/northern-ondo-remote-sensing/assets/NDWI_Change_2016_2025

projects/northern-ondo-remote-sensing/assets/Annual_Rainfall_Change_2016_2025

projects/northern-ondo-remote-sensing/assets/Exploratory_Environmental_Conditions_Index
```

These assets preserve the main derived raster products used in the project.

---

## 18. Google Drive Raster Exports

Seven final GeoTIFF products were exported to the Google Drive folder:

`GEE_Exports`

The exported files were:

```text
LULC_2016_Northern_Ondo.tif
LULC_2025_Northern_Ondo.tif
LULC_Transitions_2016_2025_Northern_Ondo.tif
NDVI_Change_2016_2025_Northern_Ondo.tif
NDWI_Change_2016_2025_Northern_Ondo.tif
Annual_Rainfall_Change_2016_2025_Northern_Ondo.tif
Exploratory_Environmental_Conditions_Index_Northern_Ondo.tif
```

The rainfall product was exported at approximately **5500 m**, reflecting the coarse spatial resolution of CHIRPS.

The remaining primary raster products were exported at **10 m**.

---

## 19. QGIS Processing

The final raster products were imported into QGIS 3.44.9 for cartographic production.

The QGIS project used:

**WGS 84 / UTM Zone 31N — EPSG:32631**

Eight final maps were produced:

1. Study Area — Six LGAs of Northern Ondo State
2. LULC 2016
3. LULC 2025
4. LULC Transitions 2016–2025
5. NDVI Change 2016–2025
6. NDWI Change 2016–2025
7. Annual Rainfall Change 2016–2025
8. Exploratory Environmental Conditions Relevant to Groundwater Recharge

---

## 20. Map Export Decisions

Only the **JPEG versions** of the final maps are included in the GitHub repository.

The eight repository map files are:

```text
Study_Area_Northern_Ondo_Six_LGAs_Map.jpeg
LULC_2016_Map.jpeg
LULC_2025_Map.jpeg
LULC_Transition_2016_2025_Map.jpeg
NDVI_Change_2016_2025_Map.jpeg
NDWI_Change_2016_2025_Map.jpeg
Annual_Rainfall_Change_2016_2025_Map.jpeg
Environmental_Conditions_Index_Map.jpeg
```

PDF versions were retained separately for printing and formal presentation but are not included in the repository.

No separate `figures/` directory is required because no independent analytical figures were exported.

---

## 21. Cartographic Notes

The final maps use a consistent A4 landscape layout.

Common map elements include:

* Title
* Legend
* North arrow
* Scale bar
* LGA boundaries
* Source/methodological note
* Projection information

The six LGA boundaries were retained as visible administrative boundaries on the analytical maps.

A dissolved study-area boundary was used specifically for the study-area map to provide a clean outer boundary.

---

## 22. LULC Map Symbology

The LULC maps use the same six-class scheme for 2016 and 2025:

```text
Built-up / Urban           — red
Cropland                   — yellow
Forest / Woodland          — dark green
Shrubland / Grassland      — light green
Bare / Sparse Vegetation   — brown
Surface Water              — blue
```

---

## 23. LULC Transition Map Symbology

The transition map highlights selected major transitions while displaying minor and unchanged transitions in subdued grey.

Highlighted transitions include:

```text
Cropland → Forest
Forest → Shrubland/Grassland
Cropland → Shrubland/Grassland
Forest → Cropland
Shrubland/Grassland → Cropland
Bare/Sparse Vegetation → Shrubland/Grassland
```

Stable classes and less prominent transitions were displayed in light grey to keep the main changes clear.

---

## 24. NDVI Change Map Symbology

NDVI change was displayed using five discrete equal-interval classes.

The raster range used for the final map was approximately:

**−0.69 to +0.60**

The classes represent:

1. Vegetation Loss / Degradation
2. Moderate Vegetation Decline
3. Little / No Change
4. Moderate Vegetation Increase
5. Vegetation Gain / Improvement

These labels describe the direction and relative magnitude of NDVI change. They do not represent statistically significant vegetation changes.

---

## 25. NDWI Change Map Symbology

NDWI change was displayed using five discrete equal-interval classes.

The raster range used for the final map was approximately:

**−0.418 to +0.557**

The classes represent:

1. Reduced Water / Moisture Signal
2. Moderate Water / Moisture Decline
3. Little / No Change
4. Moderate Water / Moisture Increase
5. Increased Water / Moisture Signal

The wording avoids presenting NDWI change as direct surface-water loss or gain.

---

## 26. Rainfall Change Map Symbology

Annual rainfall change was displayed using a continuous diverging colour ramp.

The mapped range was approximately:

**−157.205 to +106.319 mm**

The legend was rounded to whole millimetres to avoid implying unnecessary precision.

Negative values represent a decrease in annual rainfall, while positive values represent an increase.

The coarse/blocky appearance of the rainfall raster is expected because the source CHIRPS data have an approximate 5.5 km spatial resolution.

---

## 27. Environmental Conditions Index Map Symbology

The Environmental Conditions Index was displayed using five discrete equal-interval classes:

```text
−1.023 to −0.509   — Relatively Less Favourable
−0.509 to 0.005    — Moderately Less Favourable
0.005 to 0.519     — Near Average / Moderately Favourable
0.519 to 1.034     — Favourable
1.034 to 1.549     — Highly Favourable
```

These categories describe relative environmental conditions relevant to groundwater recharge.

They do not represent measured recharge rates.

---

## 28. Reproducibility Notes

Important reproducibility settings include:

* Sentinel-2 collection: `COPERNICUS/S2_SR_HARMONIZED`
* Cloudy-pixel threshold: <20%
* Seasonal window: January–March
* Random Forest trees: 100
* Random seed: 42
* Training/validation split: 70/30
* LULC classes: 6
* Sentinel-2 predictor bands: B2, B3, B4, B8, B11, B12
* Main Sentinel-2 raster scale: 10 m
* CHIRPS rainfall scale: approximately 5500 m
* QGIS CRS: EPSG:32631

---

## 29. Final Processing Summary

The completed workflow was:

**Data Collection → Sentinel-2 Preprocessing → Training Sample Creation → LULC Classification → Accuracy Assessment → LULC Change Analysis → NDVI Analysis → NDWI Analysis → Rainfall Analysis → Correlation/Trend Analysis → Environmental Conditions Index → Raster Export → QGIS Cartography → Final Map Export**

The repository preserves the main scripts, methodology, processing decisions, results and final cartographic outputs needed to understand the workflow.
