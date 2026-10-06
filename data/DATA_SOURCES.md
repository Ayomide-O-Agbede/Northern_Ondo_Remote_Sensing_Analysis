# Data Sources

## Project

**Remote-Sensing Assessment of Environmental Conditions Relevant to Groundwater Recharge in Northern Ondo State, Nigeria**

This document describes the primary datasets used for the remote-sensing and geospatial analysis conducted for the six northern Local Government Areas (LGAs) of Ondo State, Nigeria.

---

## 1. Study Area Boundary

The study area consists of six LGAs in northern Ondo State:

* Akoko North-East
* Akoko North-West
* Akoko South-East
* Akoko South-West
* Ose
* Owo

The boundary dataset was uploaded to Google Earth Engine as:

`projects/northern-ondo-remote-sensing/assets/Northern_Ondo_Six_LGAs`

The six LGA features were retained as individual administrative units to support spatial comparison and cartographic presentation.

---

## 2. Sentinel-2 Surface Reflectance

**Dataset:** Sentinel-2 Surface Reflectance Harmonized

**Google Earth Engine collection:**

`COPERNICUS/S2_SR_HARMONIZED`

Sentinel-2 imagery was used for:

* Land Use/Land Cover (LULC) classification
* Normalized Difference Vegetation Index (NDVI)
* Normalized Difference Water Index (NDWI)
* Environmental-condition analysis

### Spectral bands used

| Band | Description                    | Resolution |
| ---- | ------------------------------ | ---------: |
| B2   | Blue                           |       10 m |
| B3   | Green                          |       10 m |
| B4   | Red                            |       10 m |
| B8   | Near Infrared (NIR)            |       10 m |
| B11  | Short-Wave Infrared 1 (SWIR 1) |       20 m |
| B12  | Short-Wave Infrared 2 (SWIR 2) |       20 m |

For LULC classification, the predictor bands were:

**B2, B3, B4, B8, B11 and B12.**

The analysis covered **2016–2025**, with January–March seasonal composites used for the main Sentinel-2 analyses.

---

## 3. Sentinel-2 Cloud and Scene Filtering

Sentinel-2 scenes were filtered to the study area and restricted to scenes with:

**Cloudy Pixel Percentage < 20%**

The Sentinel-2 Scene Classification Layer (SCL) was used to remove unwanted pixels.

The following SCL classes were masked:

* 3 — Cloud shadow
* 8 — Cloud medium probability
* 9 — Cloud high probability
* 10 — Thin cirrus
* 11 — Snow/ice

A median composite was then generated for each analysis period and clipped to the study area.

---

## 4. CHIRPS Rainfall

**Dataset:** Climate Hazards Center InfraRed Precipitation with Station data (CHIRPS)

CHIRPS rainfall data were used to analyse:

* Annual rainfall totals
* January–March rainfall totals
* Interannual rainfall variability
* Rainfall change between 2016 and 2025
* Relationships between rainfall and NDVI/NDWI

The CHIRPS dataset has an approximate spatial resolution of **0.05° (about 5.5 km)**.

Because of this relatively coarse spatial resolution, rainfall results were interpreted at the regional/study-area scale rather than as fine-scale local rainfall patterns.

---

## 5. Derived Remote-Sensing Products

Several environmental indicators were derived from the Sentinel-2 and CHIRPS datasets.

### NDVI

The Normalized Difference Vegetation Index was calculated as:

**NDVI = (NIR − Red) / (NIR + Red)**

Using Sentinel-2:

* NIR = B8
* Red = B4

NDVI was used to assess vegetation-condition patterns and changes between 2016 and 2025.

---

### NDWI

The Normalized Difference Water Index was calculated as:

**NDWI = (Green − NIR) / (Green + NIR)**

Using Sentinel-2:

* Green = B3
* NIR = B8

NDWI was used as a spectral indicator of surface-water/moisture conditions and their spatial and temporal variation.

---

### LULC Classification

A supervised Random Forest classification was used to produce six LULC classes:

| Class | Land-cover class         |
| ----: | ------------------------ |
|     0 | Built-up / Urban         |
|     1 | Cropland                 |
|     2 | Forest / Woodland        |
|     3 | Shrubland / Grassland    |
|     4 | Bare / Sparse Vegetation |
|     5 | Surface Water            |

Independent classifications were produced for **2016 and 2025** using the same classification framework and training dataset.

---

## 6. Training Data

Training polygons were manually delineated in Google Earth Engine for the six LULC classes.

The final training dataset contained:

* 8 Built-up polygons
* 8 Cropland polygons
* 8 Forest polygons
* 8 Shrub/Grassland polygons
* 8 Bare/Sparse Vegetation polygons
* 4 Surface Water polygons

**Total: 44 training polygons**

The polygons were used to generate pixel samples for supervised classification.

---

## 7. Accuracy Assessment Data

The sampled LULC pixels were randomly divided into:

* **70% training data**
* **30% validation data**

A fixed random seed of **42** was used to make the sampling and classification process reproducible.

Accuracy assessment was based on:

* Overall Accuracy
* Kappa Coefficient
* Confusion Matrix
* Producer's Accuracy
* User's Accuracy

The validation samples were derived from the manually delineated training regions; therefore, the accuracy assessment should not be considered equivalent to independent field validation.

---

## 8. Derived Change Products

The following change products were generated for the 2016–2025 period:

* LULC 2016
* LULC 2025
* LULC transitions, 2016–2025
* NDVI change, 2016–2025
* NDWI change, 2016–2025
* Annual rainfall change, 2016–2025
* Exploratory Environmental Conditions Index

The LULC transition analysis was performed using a coded combination of the 2016 and 2025 classified images.

---

## 9. Environmental Conditions Index

An exploratory Environmental Conditions Index was developed by integrating standardized changes in:

* NDVI
* NDWI
* Annual rainfall

Each variable was standardized relative to the study area, and the three standardized layers were averaged.

The resulting index represents **relative environmental conditions relevant to groundwater recharge**, rather than measured groundwater recharge or groundwater recharge potential.

---

## 10. Google Earth Engine Assets

The following derived products were stored as Google Earth Engine assets:

```text
projects/northern-ondo-remote-sensing/assets/LULC_2016
projects/northern-ondo-remote-sensing/assets/LULC_2025
projects/northern-ondo-remote-sensing/assets/LULC_Transitions_2016_2025
projects/northern-ondo-remote-sensing/assets/NDVI_Change_2016_2025
projects/northern-ondo-remote-sensing/assets/NDWI_Change_2016_2025
projects/northern-ondo-remote-sensing/assets/Annual_Rainfall_Change_2016_2025
projects/northern-ondo-remote-sensing/assets/Exploratory_Environmental_Conditions_Index
```

---

## 11. Software and Platforms

The project was developed using:

* **Google Earth Engine** — satellite-data processing, classification, temporal analysis and derived environmental products
* **Google Cloud / Earth Engine Cloud Project** — project and asset management
* **QGIS 3.44.9** — cartographic visualization, map production and final map exports
* **Git/GitHub** — project documentation and version-controlled portfolio presentation

No Python-based analysis was used in this project.

---

## 12. Data and Methodological Considerations

The analysis has several important limitations:

1. Sentinel-2 observations are affected by cloud availability, seasonal conditions and spectral variability.
2. LULC classification accuracy is based on validation samples derived from manually delineated training regions rather than independent field observations.
3. CHIRPS rainfall has a substantially coarser spatial resolution than Sentinel-2 imagery.
4. NDVI and NDWI are spectral indicators and should not be interpreted as direct measurements of groundwater recharge.
5. LULC transitions describe changes in classified land-cover categories but do not establish the causes of those changes.
6. The Environmental Conditions Index is an exploratory relative index and should not be interpreted as a quantitative groundwater recharge model.
7. The 2016 and 2025 classifications may contain classification uncertainty that can influence estimated area changes and transition patterns.

---

## Summary

The project integrates **Sentinel-2 satellite imagery, CHIRPS rainfall data and administrative boundary information** within Google Earth Engine and QGIS to examine changes in land cover, vegetation, surface-water/moisture spectral response and rainfall across six LGAs of Northern Ondo State between 2016 and 2025.

These datasets provide a geospatial basis for assessing environmental conditions relevant to groundwater recharge and water-resource management, while recognising that direct groundwater recharge estimation would require additional hydrogeological, climatic and/or hydrological modelling data.
