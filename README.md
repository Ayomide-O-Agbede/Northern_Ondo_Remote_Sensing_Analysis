# Remote-Sensing Assessment of Environmental Conditions Relevant to Groundwater Recharge in Northern Ondo State, Nigeria

## Overview

This project uses **Google Earth Engine and QGIS** to assess spatial and temporal changes in land use/land cover, vegetation, surface-water/moisture spectral response and rainfall across six Local Government Areas (LGAs) of Northern Ondo State, Nigeria.

The analysis covers **2016–2025** and examines how these environmental patterns may provide context for conditions relevant to groundwater recharge.

The study does **not** directly calculate groundwater recharge rates. Instead, it integrates remotely sensed environmental indicators to provide a spatial assessment that can support groundwater and water-resource investigations.

---

## Study Area

The study covers six LGAs in Northern Ondo State:

* Akoko North-East
* Akoko North-West
* Akoko South-East
* Akoko South-West
* Ose
* Owo

The study area was processed in **Google Earth Engine** and mapped in **QGIS 3.44.9** using WGS 84 / UTM Zone 31N (EPSG:32631).

---

## Aim

To assess spatial and temporal patterns in land cover, vegetation, surface water and rainfall across Northern Ondo State and examine their relevance to environmental conditions associated with groundwater recharge.

---

## Objectives

1. Assess land use/land cover characteristics and changes between 2016 and 2025.
2. Analyse vegetation dynamics using NDVI.
3. Assess surface-water/moisture spectral patterns using NDWI.
4. Examine annual and January–March rainfall variability using CHIRPS.
5. Explore relationships between rainfall, vegetation and water/moisture spectral indicators.
6. Integrate selected environmental indicators into an exploratory Environmental Conditions Index relevant to groundwater recharge.

---

## Data

### Sentinel-2

Sentinel-2 Surface Reflectance Harmonized imagery was used for:

* LULC classification
* NDVI
* NDWI
* Environmental-condition analysis

Main predictor bands:

* B2 — Blue
* B3 — Green
* B4 — Red
* B8 — Near Infrared
* B11 — SWIR 1
* B12 — SWIR 2

January–March seasonal composites were used for the main Sentinel-2 analysis.

### CHIRPS

CHIRPS precipitation data were used to assess:

* Annual rainfall
* January–March rainfall
* Rainfall variability
* Rainfall change between 2016 and 2025

CHIRPS has an approximate spatial resolution of **5.5 km**.

---

## Methodology

### Sentinel-2 Preprocessing

Sentinel-2 Surface Reflectance Harmonized imagery was filtered using:

* Study-area boundary
* Cloudy-pixel percentage <20%
* Scene Classification Layer masking

The following SCL classes were masked:

* Cloud shadow
* Medium/high probability cloud
* Thin cirrus
* Snow/ice

Median seasonal composites were then generated.

### LULC Classification

Six land-cover classes were mapped:

| Class | Description              |
| ----: | ------------------------ |
|     0 | Built-up / Urban         |
|     1 | Cropland                 |
|     2 | Forest / Woodland        |
|     3 | Shrubland / Grassland    |
|     4 | Bare / Sparse Vegetation |
|     5 | Surface Water            |

A total of **44 training polygons** were used.

Pixel samples were divided into:

* 70% training
* 30% validation

A Random Forest classifier with **100 trees** and seed **42** was used.

Independent classifications were produced for 2016 and 2025.

### Accuracy

| Year | Overall Accuracy | Kappa |
| ---- | ---------------: | ----: |
| 2016 |           92.60% | 0.902 |
| 2025 |           89.41% | 0.869 |

### NDVI

NDVI was calculated as:

**NDVI = (NIR − Red) / (NIR + Red)**

using Sentinel-2 B8 and B4.

### NDWI

NDWI was calculated as:

**NDWI = (Green − NIR) / (Green + NIR)**

using Sentinel-2 B3 and B8.

### LULC Change

LULC transitions were calculated by combining the 2016 and 2025 class values:

**Transition Code = (2016 Class × 10) + 2025 Class**

### Environmental Conditions Index

An exploratory index was created from standardized changes in:

* NDVI
* NDWI
* Annual rainfall

The standardized layers were averaged to produce a relative Environmental Conditions Index.

This index is **not a groundwater recharge rate or recharge-potential model**.

---

## Key Results

### LULC Change

Between 2016 and 2025:

* Forest/Woodland increased by **256.23 km²**.
* Shrubland/Grassland increased by **307.48 km²**.
* Cropland decreased by **242.92 km²**.
* Bare/Sparse Vegetation decreased by **189.06 km²**.
* Surface Water decreased by **83.25 km²**.
* Built-up/Urban decreased by **21.57 km²** in the classified results.

The largest observed inter-class transition was:

**Cropland → Forest: 432.18 km²**

These classified changes should not be interpreted as proof of the processes responsible for the changes.

### NDVI

Mean January–March NDVI increased from:

**0.472 in 2016 → 0.501 in 2025**

Approximately **63.78%** of the valid comparison area showed an increase in NDVI.

### NDWI

Mean January–March NDWI changed from:

**−0.529 in 2016 → −0.550 in 2025**

Approximately **63.23%** of the valid comparison area showed a decrease in NDWI.

NDWI change represents a change in spectral water/moisture response and not direct surface-water volume change.

### Rainfall

Annual rainfall showed substantial interannual variability.

The fitted annual rainfall trend was:

**+4.43 mm/year**

but was not statistically significant:

**r = 0.091, p = 0.802**

January–March rainfall showed a fitted trend of:

**−2.38 mm/year**

which was also not statistically significant:

**r = −0.197, p = 0.586**

### Correlations

January–March rainfall and NDVI:

**r = 0.040, p = 0.913**

January–March rainfall and NDWI:

**r = 0.042, p = 0.909**

January–March NDVI and NDWI:

**r = −0.917, p < 0.001**

The correlations are exploratory and do not establish causation.

---

## Final Maps

Eight final maps were produced in QGIS.

### Study Area

![Study Area](maps/Study_Area_Northern_Ondo_Six_LGAs_Map.jpeg)

### LULC 2016

![LULC 2016](maps/LULC_2016_Map.jpeg)

### LULC 2025

![LULC 2025](maps/LULC_2025_Map.jpeg)

### LULC Transitions 2016–2025

![LULC Transitions](maps/LULC_Transition_2016_2025_Map.jpeg)

### NDVI Change 2016–2025

![NDVI Change](maps/NDVI_Change_2016_2025_Map.jpeg)

### NDWI Change 2016–2025

![NDWI Change](maps/NDWI_Change_2016_2025_Map.jpeg)

### Annual Rainfall Change 2016–2025

![Annual Rainfall Change](maps/Annual_Rainfall_Change_2016_2025_Map.jpeg)

### Exploratory Environmental Conditions Index

![Environmental Conditions Index](maps/Environmental_Conditions_Index_Map.jpeg)

---

## Repository Structure

```text
Northern_Ondo_Remote_Sensing_Analysis/
│
├── README.md
│
├── data/
│   └── DATA_SOURCES.md
│
├── gee/
│   ├── 01_Sentinel2_Preprocessing.js
│   ├── 02_NDVI_NDWI.js
│   ├── 03_LULC_Classification.js
│   ├── 04_LULC_Classification.js
│   ├── 05_Temporal_Analysis.js
│   ├── 06_LULC_2016.js
│   ├── 07_Environmental_Integration.js
│   └── 08_Final_Exports.js
│
├── qgis/
│   └── Northern_Ondo_Remote_Sensing_Analysis.qgz
│
├── maps/
│   ├── Study_Area_Northern_Ondo_Six_LGAs_Map.jpeg
│   ├── LULC_2016_Map.jpeg
│   ├── LULC_2025_Map.jpeg
│   ├── LULC_Transition_2016_2025_Map.jpeg
│   ├── NDVI_Change_2016_2025_Map.jpeg
│   ├── NDWI_Change_2016_2025_Map.jpeg
│   ├── Annual_Rainfall_Change_2016_2025_Map.jpeg
│   └── Environmental_Conditions_Index_Map.jpeg
│
└── documentation/
    ├── METHODOLOGY.md
    ├── PROCESSING_NOTES.md
    └── RESULTS.md
```

---

## Software

* Google Earth Engine
* Google Cloud / Earth Engine Cloud Project
* QGIS 3.44.9
* Git / GitHub

No Python-based analysis was used in this project.

---

## Limitations

This project provides an environmental remote-sensing assessment rather than a direct groundwater-recharge model.

Important limitations include:

* LULC accuracy was assessed using validation samples derived from manually delineated training regions.
* CHIRPS rainfall has a substantially coarser spatial resolution than Sentinel-2.
* NDVI and NDWI are indirect environmental indicators.
* LULC transitions do not establish the causes of land-cover change.
* The Environmental Conditions Index is exploratory and uses an equal-weight combination of standardized variables.
* The analysis does not directly estimate groundwater levels, aquifer properties, infiltration rates or recharge rates.

A quantitative groundwater-recharge assessment would require additional hydrogeological and hydrological data.

---

## Project Significance

This project demonstrates an integrated **remote sensing + GIS workflow** for environmental assessment relevant to groundwater studies.

It combines:

**Satellite Remote Sensing → Land-Cover Classification → Change Detection → Vegetation Analysis → Water/Moisture Analysis → Rainfall Analysis → Environmental Integration → GIS Cartography**

The workflow provides a foundation for future integration with hydrogeological observations, groundwater-level data, geophysical investigations and hydrological modelling.
