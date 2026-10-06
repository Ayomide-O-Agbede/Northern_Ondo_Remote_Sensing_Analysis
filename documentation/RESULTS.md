# Results

## 1. Overview

The analysis assessed land use/land cover (LULC), vegetation condition, surface-water/moisture spectral response and rainfall across six LGAs of Northern Ondo State between 2016 and 2025.

The main results include:

* LULC classification accuracy for 2016 and 2025
* LULC area and percentage changes
* LULC transition patterns
* NDVI temporal and spatial changes
* NDWI temporal and spatial changes
* Annual and January–March rainfall variability
* Relationships among rainfall, NDVI and NDWI
* An exploratory Environmental Conditions Index

---

## 2. LULC Classification Accuracy

Independent Random Forest classifications were produced for 2016 and 2025 using the same six-class classification framework.

| Year | Overall Accuracy | Kappa |
| ---- | ---------------: | ----: |
| 2016 |           92.60% | 0.902 |
| 2025 |           89.41% | 0.869 |

The results indicate good overall classification performance for both years.

The 2016 classification achieved slightly higher accuracy than the 2025 classification. However, the accuracy values should be interpreted with caution because the validation samples were derived from manually delineated training regions rather than independent field observations.

---

## 3. LULC Area Change

The classified areas for the six LULC classes are presented below.

| Class                    | 2016 Area (km²) | 2025 Area (km²) | Change (km²) | 2016 (%) | 2025 (%) | Change (percentage points) |
| ------------------------ | --------------: | --------------: | -----------: | -------: | -------: | -------------------------: |
| Built-up / Urban         |          104.59 |           83.03 |       -21.57 |     2.51 |     1.98 |                      -0.53 |
| Cropland                 |          809.59 |          566.68 |      -242.92 |    19.46 |    13.53 |                      -5.93 |
| Forest / Woodland        |         2035.53 |         2291.76 |      +256.23 |    48.92 |    54.72 |                      +5.80 |
| Shrubland / Grassland    |          874.10 |         1181.58 |      +307.48 |    21.01 |    28.21 |                      +7.21 |
| Bare / Sparse Vegetation |          236.16 |           47.10 |      -189.06 |     5.68 |     1.12 |                      -4.55 |
| Surface Water            |          100.95 |           17.70 |       -83.25 |     2.43 |     0.42 |                      -2.00 |

The largest increase in mapped area occurred in **Shrubland/Grassland**, which increased by approximately **307.48 km²**.

Forest/Woodland increased by approximately **256.23 km²**.

The largest decreases occurred in:

* Cropland: **−242.92 km²**
* Bare/Sparse Vegetation: **−189.06 km²**
* Surface Water: **−83.25 km²**
* Built-up/Urban: **−21.57 km²**

The results describe changes in classified land-cover categories and should not, by themselves, be interpreted as proof of the processes responsible for those changes.

---

## 4. LULC Transition Analysis

The transition analysis identified the major class-to-class changes between 2016 and 2025.

### Major transitions

| Transition                                   | Area (km²) |
| -------------------------------------------- | ---------: |
| Forest → Forest                              |    1636.66 |
| Cropland → Forest                            |     432.18 |
| Forest → Shrubland/Grassland                 |     223.68 |
| Cropland → Shrubland/Grassland               |     218.66 |
| Forest → Cropland                            |     192.54 |
| Shrubland/Grassland → Shrubland/Grassland    |     514.51 |
| Shrubland/Grassland → Cropland               |     169.58 |
| Bare/Sparse Vegetation → Shrubland/Grassland |     149.59 |

The largest observed change between different classes was **Cropland → Forest**, covering approximately **432.18 km²**.

The reverse transition, **Forest → Cropland**, covered approximately **192.54 km²**.

This indicates a net exchange between these two classes in favour of Forest/Woodland, but the classification results alone cannot establish the causes of the observed transitions.

Similarly, the increase in mapped Forest/Woodland does not necessarily represent natural forest regeneration. Possible influences include land-use change, vegetation recovery, land abandonment, seasonal spectral differences and classification uncertainty.

---

## 5. NDVI Temporal Variation

Mean January–March NDVI values were calculated for each year from 2016 to 2025.

| Year | Mean NDVI |
| ---- | --------: |
| 2016 |     0.472 |
| 2017 |     0.523 |
| 2018 |     0.488 |
| 2019 |     0.408 |
| 2020 |     0.438 |
| 2021 |     0.419 |
| 2022 |     0.422 |
| 2023 |     0.482 |
| 2024 |     0.533 |
| 2025 |     0.501 |

Mean NDVI increased from **0.472 in 2016** to **0.501 in 2025**, representing an approximate **6.12% increase relative to the 2016 mean**.

The highest mean NDVI occurred in **2024 (0.533)**, while the lowest occurred in **2019 (0.408)**.

The annual values show considerable interannual variability rather than a consistently increasing or decreasing pattern.

---

## 6. Spatial NDVI Change

NDVI change was calculated as:

**NDVI Change = 2025 NDVI − 2016 NDVI**

Within the valid analysis area:

* **2671.33 km² (63.78%)** showed an increase in NDVI.
* **1516.88 km² (36.22%)** showed a decrease.

The spatial results therefore indicate that a larger proportion of the analysed area experienced an increase in vegetation spectral response between 2016 and 2025.

This should not be interpreted directly as an increase in groundwater recharge because NDVI primarily represents vegetation-related spectral characteristics.

---

## 7. NDWI Temporal Variation

Mean January–March NDWI values were calculated for each year.

| Year | Mean NDWI |
| ---- | --------: |
| 2016 |    -0.529 |
| 2017 |    -0.646 |
| 2018 |    -0.571 |
| 2019 |    -0.421 |
| 2020 |    -0.481 |
| 2021 |    -0.436 |
| 2022 |    -0.454 |
| 2023 |    -0.512 |
| 2024 |    -0.558 |
| 2025 |    -0.550 |

Mean NDWI changed from **−0.529 in 2016** to **−0.550 in 2025**.

The mean change was approximately **−0.022**.

The most positive mean NDWI occurred in **2019 (−0.421)**, while the most negative occurred in **2017 (−0.646)**.

Because NDWI is a spectral indicator, these values should not be interpreted as direct measurements of surface-water volume or groundwater conditions.

---

## 8. Spatial NDWI Change

NDWI change was calculated as:

**NDWI Change = 2025 NDWI − 2016 NDWI**

Within the valid analysis area:

* **1540.02 km² (36.77%)** showed an increase in NDWI.
* **2648.19 km² (63.23%)** showed a decrease.

The larger proportion of negative NDWI change indicates that the water/moisture spectral response decreased over a greater area during the comparison period.

This does not mean that surface-water area or groundwater storage decreased by the same proportion.

---

## 9. Annual Rainfall

Annual CHIRPS rainfall totals varied substantially during 2016–2025.

| Year | Annual Rainfall (mm) |
| ---- | -------------------: |
| 2016 |               1421.5 |
| 2017 |               1330.8 |
| 2018 |               1698.7 |
| 2019 |               1606.3 |
| 2020 |               1249.6 |
| 2021 |               1499.4 |
| 2022 |               1475.2 |
| 2023 |               1677.3 |
| 2024 |               1526.9 |
| 2025 |               1378.0 |

The wettest year was **2018**, with approximately **1698.7 mm** of rainfall.

The driest year was **2020**, with approximately **1249.6 mm**.

A fitted linear trend produced a slope of approximately:

**+4.43 mm/year**

However, the relationship was weak and statistically non-significant:

* **r = 0.091**
* **p = 0.802**

Therefore, the analysis does not provide evidence of a significant long-term increase in annual rainfall over the study period.

---

## 10. January–March Rainfall

January–March rainfall also showed substantial interannual variation.

| Year | January–March Rainfall (mm) |
| ---- | --------------------------: |
| 2016 |                       156.8 |
| 2017 |                        62.5 |
| 2018 |                       150.3 |
| 2019 |                       128.6 |
| 2020 |                        84.1 |
| 2021 |                        79.7 |
| 2022 |                        78.5 |
| 2023 |                       162.6 |
| 2024 |                       100.7 |
| 2025 |                        93.8 |

January–March rainfall decreased from approximately **156.8 mm in 2016** to **93.8 mm in 2025**, a difference of approximately **63.0 mm** or **40.18% relative to the 2016 value**.

A fitted linear trend produced a slope of:

**−2.38 mm/year**

The trend was weak and statistically non-significant:

* **r = −0.197**
* **p = 0.586**

Therefore, the observed decline between the endpoint years should not be interpreted as evidence of a statistically significant long-term downward trend.

---

## 11. Rainfall–NDVI Relationship

January–March rainfall and mean NDVI showed a very weak positive correlation:

* **r = 0.040**
* **p = 0.913**

The result indicates no detectable linear relationship between January–March rainfall totals and mean NDVI across the ten-year period.

This does not imply that rainfall has no influence on vegetation. Rather, vegetation condition can be affected by multiple factors, including soil conditions, land cover, antecedent moisture, agricultural practices and other climatic variables.

---

## 12. Rainfall–NDWI Relationship

January–March rainfall and mean NDWI also showed a very weak positive correlation:

* **r = 0.042**
* **p = 0.909**

The relationship was not statistically significant.

Therefore, the analysis did not identify a detectable linear association between January–March rainfall totals and the mean NDWI signal across the study period.

---

## 13. NDVI–NDWI Relationship

January–March mean NDVI and NDWI showed a very strong negative correlation:

* **r = −0.917**
* **p < 0.001**

This indicates that years with higher mean NDVI values tended to coincide with more negative mean NDWI values.

The relationship should not be interpreted as a direct causal relationship between vegetation and surface-water availability. Both indices respond to land-surface characteristics and have different spectral sensitivities.

---

## 14. Exploratory Environmental Conditions Index

An exploratory Environmental Conditions Index was developed by averaging standardized changes in:

* NDVI
* NDWI
* Annual rainfall

The resulting index had the following summary statistics in the Google Earth Engine analysis:

| Statistic |  Value |
| --------- | -----: |
| Minimum   | -1.533 |
| Mean      |  0.035 |
| Maximum   |  1.890 |

The mean value close to zero is expected because the component variables were standardized.

Positive index values indicate relatively more favourable environmental conditions compared with the study-area average, while negative values indicate relatively less favourable conditions.

The index is intended as an exploratory synthesis and **does not represent measured groundwater recharge or groundwater recharge potential**.

---

## 15. Integrated Interpretation

The combined results show several important patterns across Northern Ondo State during 2016–2025:

1. Forest/Woodland and Shrubland/Grassland increased in mapped area, while Cropland and Bare/Sparse Vegetation decreased.
2. Cropland → Forest was the largest observed inter-class transition.
3. Mean January–March NDVI increased between the two endpoint years, and NDVI increased across approximately 63.78% of the valid comparison area.
4. Mean NDWI became slightly more negative, with approximately 63.23% of the valid comparison area showing negative NDWI change.
5. Annual rainfall exhibited substantial interannual variability but no statistically significant linear trend.
6. January–March rainfall also showed a weak, statistically non-significant fitted decline.
7. Rainfall showed no detectable linear relationship with either mean NDVI or mean NDWI over the ten-year period.
8. NDVI and NDWI showed a strong negative correlation, but this association should not be interpreted causally.
9. The exploratory Environmental Conditions Index provides a relative spatial synthesis of environmental changes rather than a quantitative recharge estimate.

---

## 16. Key Implications for Groundwater-Recharge Assessment

The results demonstrate how remote sensing and GIS can provide useful environmental context for groundwater studies.

Areas experiencing changes in vegetation, land cover, rainfall and water/moisture spectral response may have different environmental conditions relevant to infiltration, evapotranspiration and surface-water interactions.

However, the present analysis does not directly quantify:

* groundwater recharge rate
* aquifer recharge potential
* groundwater storage
* hydraulic conductivity
* groundwater levels
* infiltration rate

A quantitative groundwater-recharge assessment would require additional hydrogeological and hydrological information, such as groundwater-level observations, soil properties, aquifer characteristics, evapotranspiration, infiltration measurements and/or hydrological modelling.

---

## 17. Summary of Major Findings

| Indicator                  | Main finding                   |
| -------------------------- | ------------------------------ |
| 2016 LULC accuracy         | 92.60%                         |
| 2025 LULC accuracy         | 89.41%                         |
| Forest/Woodland change     | +256.23 km²                    |
| Shrubland/Grassland change | +307.48 km²                    |
| Cropland change            | −242.92 km²                    |
| Bare/Sparse change         | −189.06 km²                    |
| Surface Water change       | −83.25 km²                     |
| Mean NDVI change           | +0.029                         |
| Spatial NDVI increase      | 63.78%                         |
| Spatial NDVI decrease      | 36.22%                         |
| Mean NDWI change           | −0.022                         |
| Spatial NDWI increase      | 36.77%                         |
| Spatial NDWI decrease      | 63.23%                         |
| Annual rainfall trend      | +4.43 mm/year, not significant |
| Jan–Mar rainfall trend     | −2.38 mm/year, not significant |
| Rainfall–NDVI correlation  | r = 0.040, p = 0.913           |
| Rainfall–NDWI correlation  | r = 0.042, p = 0.909           |
| NDVI–NDWI correlation      | r = −0.917, p < 0.001          |
| Environmental Index mean   | 0.035                          |

These findings provide a remote-sensing-based assessment of environmental changes relevant to groundwater recharge conditions across Northern Ondo State while maintaining the distinction between environmental indicators and direct groundwater-recharge measurements.
