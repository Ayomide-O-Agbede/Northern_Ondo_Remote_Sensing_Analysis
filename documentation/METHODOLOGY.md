# Methodology

## 1. Project Overview

This study assessed spatial and temporal patterns in land cover, vegetation, surface-water/moisture spectral response and rainfall across six Local Government Areas (LGAs) of Northern Ondo State, Nigeria.

The analysis covered **2016–2025** and examined these environmental patterns in relation to conditions relevant to groundwater recharge.

The work was carried out mainly in **Google Earth Engine (GEE)**, while **QGIS 3.44.9** was used for final spatial visualization and map production.

The study does not directly estimate groundwater recharge rates.

---

## 2. Study Area

The study area comprises six LGAs in Northern Ondo State:

1. Akoko North-East
2. Akoko North-West
3. Akoko South-East
4. Akoko South-West
5. Ose
6. Owo

The six LGA boundaries were retained as individual features in Google Earth Engine and QGIS to support spatial comparison and map presentation.

The study-area boundary was stored in Google Earth Engine as:

`projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Six_LGAs`

---

## 3. Data Preparation

### 3.1 Sentinel-2 Imagery

Sentinel-2 Surface Reflectance Harmonized imagery was obtained from:

`COPERNICUS/S2_SR_HARMONIZED`

The following bands were used:

* B2 — Blue
* B3 — Green
* B4 — Red
* B8 — Near Infrared
* B11 — SWIR 1
* B12 — SWIR 2

The imagery was filtered spatially to the study area and temporally to the required analysis periods.

January–March imagery was used for the main seasonal Sentinel-2 analysis to maintain the same seasonal window across the study period.

### 3.2 Cloud and Cloud-Shadow Masking

The Sentinel-2 Scene Classification Layer (SCL) was used to remove unwanted pixels.

The following classes were masked:

* 3 — Cloud shadow
* 8 — Cloud medium probability
* 9 — Cloud high probability
* 10 — Thin cirrus
* 11 — Snow/ice

Scenes with a reported cloudy-pixel percentage of **20% or greater** were excluded.

After masking, a median composite was generated for each analysis period and clipped to the study area.

---

## 4. Land Use/Land Cover Classification

### 4.1 Classification Scheme

Six LULC classes were defined:

| Class | Description              |
| ----: | ------------------------ |
|     0 | Built-up / Urban         |
|     1 | Cropland                 |
|     2 | Forest / Woodland        |
|     3 | Shrubland / Grassland    |
|     4 | Bare / Sparse Vegetation |
|     5 | Surface Water            |

### 4.2 Training Data

Training polygons were manually delineated in Google Earth Engine.

The final training dataset contained:

* 8 Built-up polygons
* 8 Cropland polygons
* 8 Forest polygons
* 8 Shrub/Grassland polygons
* 8 Bare/Sparse Vegetation polygons
* 4 Surface Water polygons

This gave a total of **44 training polygons**.

The polygons were selected to represent identifiable examples of each class.

### 4.3 Predictor Variables

The Random Forest predictor variables were:

**B2, B3, B4, B8, B11 and B12.**

These bands provide visible, near-infrared and short-wave infrared information for separating the six land-cover classes.

### 4.4 Sampling and Classification

Pixel samples were extracted from the training polygons and randomly divided into:

* **70% training**
* **30% validation**

A fixed random seed of **42** was used.

A **Random Forest classifier with 100 trees** was used for classification.

Separate classifications were produced for **2016 and 2025** using the same classification framework and training polygons.

---

## 5. LULC Accuracy Assessment

Classification performance was assessed using the validation samples.

The assessment included:

* Overall Accuracy
* Kappa Coefficient
* Confusion Matrix
* Producer's Accuracy
* User's Accuracy

The final overall accuracy and Kappa values were:

| Year | Overall Accuracy | Kappa |
| ---- | ---------------: | ----: |
| 2016 |           92.60% | 0.902 |
| 2025 |           89.41% | 0.869 |

The validation samples were derived from manually delineated training regions. Therefore, the accuracy assessment should not be treated as independent field validation.

---

## 6. LULC Area and Transition Analysis

Classified LULC images for 2016 and 2025 were used to calculate the area occupied by each class.

Pixel area was calculated and converted from square metres to square kilometres.

The 2016 and 2025 classified images had slightly different valid classified areas because of differences in valid pixels between the independently processed images.

LULC transitions were coded as:

**Transition Code = (2016 Class × 10) + 2025 Class**

For example:

* 12 = Cropland → Forest
* 23 = Forest → Shrubland/Grassland
* 31 = Shrubland/Grassland → Cropland

The transition raster was used to quantify the area associated with individual land-cover transitions.

Only pixels with valid classifications in both years were included in the transition analysis.

---

## 7. Vegetation Analysis Using NDVI

Vegetation condition was assessed using:

**NDVI = (NIR − Red) / (NIR + Red)**

For Sentinel-2:

* NIR = B8
* Red = B4

Mean January–March NDVI was calculated for each year from 2016 to 2025.

NDVI change was calculated as:

**NDVI Change = NDVI 2025 − NDVI 2016**

Positive values represent an increase in vegetation spectral response, while negative values represent a decrease.

NDVI was interpreted as an indicator of vegetation condition rather than a direct measurement of groundwater recharge.

---

## 8. Surface-Water/Moisture Analysis Using NDWI

The Normalized Difference Water Index was calculated as:

**NDWI = (Green − NIR) / (Green + NIR)**

For Sentinel-2:

* Green = B3
* NIR = B8

Mean January–March NDWI was calculated for each year from 2016 to 2025.

NDWI change was calculated as:

**NDWI Change = NDWI 2025 − NDWI 2016**

Positive values indicate an increase in the water/moisture spectral signal, while negative values indicate a decrease.

NDWI was treated as a spectral indicator and was not interpreted as a direct measurement of surface-water volume or groundwater recharge.

---

## 9. Rainfall Analysis

CHIRPS precipitation data were used to analyse rainfall conditions from 2016 to 2025.

Two rainfall measures were calculated:

### Annual Rainfall

Annual precipitation totals were calculated for each year.

### January–March Rainfall

January–March precipitation totals were calculated to provide a seasonal rainfall series consistent with the Sentinel-2 analysis.

Rainfall change between 2016 and 2025 was calculated as:

**Rainfall Change = Rainfall 2025 − Rainfall 2016**

Annual rainfall change was also mapped spatially across the study area.

CHIRPS has an approximate spatial resolution of **5.5 km**, so rainfall patterns were interpreted at a relatively coarse spatial scale.

---

## 10. Temporal Trend Analysis

Temporal series were examined for:

* Annual rainfall
* January–March rainfall
* Mean January–March NDVI
* Mean January–March NDWI

Linear trends were estimated for the rainfall series.

Trend strength and statistical significance were evaluated using correlation coefficients and associated p-values.

The results were interpreted as temporal associations rather than evidence of causal relationships.

---

## 11. Correlation Analysis

Pearson correlation was used to explore relationships between:

* January–March rainfall and NDVI
* January–March rainfall and NDWI
* January–March NDVI and NDWI

The analysis covered the annual values from **2016–2025**, giving ten annual observations.

The correlation results were treated as exploratory because of the small sample size and the influence of other environmental factors.

---

## 12. Exploratory Environmental Conditions Index

An exploratory Environmental Conditions Index was developed from changes in:

* NDVI
* NDWI
* Annual rainfall

Each change layer was standardized relative to its study-area distribution.

The three standardized layers were then averaged:

**Environmental Conditions Index = (Z-NDVI Change + Z-NDWI Change + Z-Rainfall Change) / 3**

Positive values indicate relatively more favourable environmental conditions compared with the study-area average, while negative values indicate relatively less favourable conditions.

The index is an exploratory synthesis of environmental indicators. It is **not a groundwater recharge rate, recharge-potential model or direct hydrogeological measurement**.

---

## 13. Google Earth Engine Processing

Google Earth Engine was used for:

* Sentinel-2 image collection and filtering
* Cloud and cloud-shadow masking
* Seasonal image compositing
* NDVI calculation
* NDWI calculation
* LULC training and Random Forest classification
* Classification accuracy assessment
* LULC area calculation
* LULC transition analysis
* Rainfall processing
* Temporal analysis
* Correlation analysis
* Environmental Conditions Index generation
* Export of final raster products

The main derived raster products were stored as Google Earth Engine assets and exported as GeoTIFF files for cartographic processing.

---

## 14. QGIS Cartographic Processing

QGIS 3.44.9 was used for final visualization and map production.

The exported raster products were loaded into QGIS and combined with the six-LGA administrative boundary.

Eight final maps were produced:

1. Study Area — Six LGAs of Northern Ondo State
2. LULC 2016
3. LULC 2025
4. LULC Transitions 2016–2025
5. NDVI Change 2016–2025
6. NDWI Change 2016–2025
7. Annual Rainfall Change 2016–2025
8. Exploratory Environmental Conditions Relevant to Groundwater Recharge

The maps were prepared using a consistent A4 landscape layout with:

* Map title
* Legend
* North arrow
* Scale bar
* Study-area/LGA boundaries
* Source and methodological notes
* Coordinate reference system information

The final cartographic project used **WGS 84 / UTM Zone 31N (EPSG:32631)**.

---

## 15. Final Raster Exports

Seven main analytical raster products were exported:

1. LULC 2016
2. LULC 2025
3. LULC Transitions 2016–2025
4. NDVI Change 2016–2025
5. NDWI Change 2016–2025
6. Annual Rainfall Change 2016–2025
7. Exploratory Environmental Conditions Index

The LULC, NDVI, NDWI and transition products were exported at **10 m**, while the CHIRPS-derived rainfall product retained a scale of approximately **5.5 km**.

---

## 16. Methodological Limitations

The following limitations should be considered when interpreting the results:

1. Remote-sensing indices provide indirect information about environmental conditions and cannot directly quantify groundwater recharge.
2. LULC classification contains uncertainty that may affect estimated area and transition values.
3. The accuracy assessment uses validation samples derived from manually delineated training regions rather than independent field data.
4. CHIRPS rainfall has a much coarser spatial resolution than Sentinel-2 imagery.
5. Differences in spectral conditions between years may influence apparent LULC and index changes.
6. Seasonal imagery does not capture all intra-annual environmental variability.
7. The Environmental Conditions Index uses a simple equal-weight combination of standardized variables and should therefore be treated as exploratory.
8. Correlation does not establish causation, particularly for relationships among rainfall, vegetation and water/moisture indices.

---

## 17. Overall Analytical Workflow

The overall workflow was:

**Study Area Definition → Sentinel-2 and CHIRPS Data Preparation → Sentinel-2 Seasonal Compositing → LULC Training → Random Forest Classification → Accuracy Assessment → LULC Area and Transition Analysis → NDVI Analysis → NDWI Analysis → Rainfall Analysis → Temporal and Correlation Analysis → Environmental Conditions Index → QGIS Cartography → Final Map Production**

This workflow combines remote sensing and GIS techniques to assess environmental conditions relevant to groundwater recharge across Northern Ondo State.
