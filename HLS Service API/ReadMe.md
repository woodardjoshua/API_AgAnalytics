#
## Harmonized Landsat-Sentinel Service

_API Documentation_
_2019_

## Service Overview


The Ag-Analytics® Harmonized Landsat-Sentinel Service (HLS) API provides the service in which a user can provide an area-of-interest (AOI) with additional customized options to retrieve the dynamics of their land at various times from the Landsat-8 (L30 Product) and Sentinel-2 (S30 Product) satellites. This service  provides information on cloud cover, statistics, and Normalized Difference Vegetation Index in addition to MSI bands information.

![HLSImage](https://gallery.mailchimp.com/8af96436d9a631880769a768b/images/64c488ec-a2f4-4de9-964e-7223824d4bea.png)
                    _Harmonized Landsat-Sentinel Service in use at analytics.ag._

 The Harmonized Landsat-Sentinel (HLS) Project is a NASA initiative to produce a Virtual Constellation (VC) of surface reflectance (SR) data from the Operational Land Imager (OLI) and MultiSpectral Instrument (MSI) onboard the Landsat-8 and Sentinel-2 remote sensing satellites, respectively. The data from these satellites creates unprecedented opportunities for timely and accurate observation of Earth status and dynamics at moderate (\&lt;30 m) spatial resolution every 2-3 days. Specifications for the HLS products used in the Ag-Analytics® Harmonized Landsat-Sentinel Service API are provided below (_information from_ [https://hls.gsfc.nasa.gov](https://hls.gsfc.nasa.gov/))

| **Product Name** | **S30** | **L30** |
| --- | --- | --- |
| Input sensor | Sentinel-2A/B MSI | Landsat-8 OLI/TIRS |
| Spatial resolution | 30 m | 30 m |
| BRDF-adjusted | Yes (except for bands 01, 05, 06, 07, 09, 10) | Yes |
| Bandpass-adjusted | Adjusted to OLI-like but no adjustment for Red Edge or water vapor | No |
| Projection | UTM | UTM |
| Tiling system | MGRS (110\*110) | MGRS (110\*110) |



## Indexes Formulas and Explanation

##### Normalized Difference Vegetation Index (NDVI)
NDVI is derived from readily available satellite imagery which is positively correlated with green vegetation cover.

_Formula:_ NDVI = (NIR - Red) / (NIR + Red)

##### Normalized Difference Tillage Index (NDTI)
Similarly, NDTI is also derived from satellite imagery but calculated with different bands. It is positively correlated with crop residue cover.

_Formula:_ NDTI= (SWIR1 - SWIR2) / (SWIR1 + SWIR2)



## General Flow of Service

When a user passes an area-of-interest (AOI) in the form of a shapefile, json, raster .tif, or geojson, the service finds the correct satellite imagery and clips each image to the AOI given. The service has the options to interpolate the result and to specify the imagery weeks that are returned.

##### General Algorithm Flow

1. Determine the AOI polygon given.

_\*\*When the interpolation option is chosen, the AOI will be a larger area (determined by the interpolation parameters) of the given field boundary. Otherwise, the AOI will be a rectangle polygon around the given AOI._

1. Identify the corresponding satellite imageries based on the AOI, acquisition date, interpolation parameters, and other options passed by users.
2. The satellite imageries will then be clipped to the AOI. If the imageries from the same date overlay with each other on the AOI, the **mean** of the overlay area will be returned and **merged** with the area without overlay from each imagery.
3. The imageries of the AOI will then be mosaiced to get weekly average imageries.
4. _(\*\*)_ If the interpolation option is chosen, the selected interpolation method and parameters will be applied to each weekly imagery where has cloud cover.

_(\*\*when interpolation is chosen)_

##### Interpolation Function

Due to cloud cover, the original satellite images may have many gaps and can not fully cover the area-of-interest (AOI). The interest to solve this problem arose in 2003, and there have been many papers and methods developed for this problem since then. After comparing and testing multiple methods and algorithms that have been used in dealing with the missing data on remote sensing satellite images, we adopted a customized &quot;inpainting&quot; method - which means filling gaps in an image by extrapolating the existing parts of the image in our API service.

To take the spatial and temporal correlation of the images into consideration, our customized inpainting algorithm &quot;inpaints&quot; a sequence of images with cloud covered for the given AOI. Each missing part (multiple pixels) at a certain location is inpainted by linear transformation of the intensity of pixels at the same location of other images where the data of these pixels are available.

##### Interpolation Algorithm Flow

1. Identify the missing parts of the image and find the contours of each gap.
2. Find the best candidates from similar sequences of images which have non-missing pixels to fill the largest part of a given gap.
3. Define an outline – a thin curve around each gap, then used for obtaining the linear transformation of the pixel intensity between the two images for each of the best candidates. The candidate image with the best linear fit of the outline is chosen.
4. To better-fit the area close to the outline, an intensity correction mask is then created by blurring the patch-intensity difference image.
5. The mask is applied to the gap area on the best candidate and generates an inpainted patch.
6. Finally, this inpainted patch is used to fill the gap in the image.

## API Specifications

##### API URL:  [**Here**](https://ag-analytics.portal.azure-api.net/docs/services/harmonized-landsat-sentinel-service/operations/hls-service)

##### Header Parameters
Execute Type: POST
content-type: &quot;application/x-www-form-urlencoded&quot;



## Request Parameters

| Parameter | Data Type | Required? | Default | Options |         Description |
| --- | --- | --- | --- | --- | --- |
| AOI | Geometry, file/text | Yes | - | JSON, GEOJSON, Shapefile, Raster | See Fig. 2 for further explanation. |
| Band | List | Yes | - | Red, Green, Blue, Coastal Aerosol, NIR, SWIR1, SWIR2, QA, NDVI, RGB, NDWI, NDBI, NDTI, UI, CIR, UE, LW, AP, AGR, FFBS, BE, VW    | Provide the list of HLS Spectral band names to retrieve for given AOI. See Figures 3-4. |
| Startdate | Date, mm/dd/yyyy | No | - | - | • Landsat – data starts from **2013** •Sentinel – data starts from **2015**    |
| Enddate | Date, mm/dd/yyyy | No | - | - | In the absence of startdate or enddate, or both, the service retrieves the latest information available on the land. |
| byweek | Int, boolean | No | 1 | 1, 0 | If set to 1, result raster will be the mosaic of all the tiles in a particular week for a given satellite |
| satellite | text | No | Landsat | Landsat, Sentinel | If set to both Landsat, Sentinel then the result raster will be the mosaic of both satellites for the given dates |
| showlatest | Int, boolean | No | 1 | - | If startdate or enddate is not given, shows the latest available tile. |
| filter | Int, boolean | No | 0 | 0, 1 | If set to 1, returns the response which is cloud-free after mosaic. |
|  qafilter  | Int, boolean | No | 0 | 0, 1 | If set to 1, continues to filter tiles until the invalid pixels are < **qacloudperc** |
| qacloudperc | float | No | 100 | 0-100 | This parameter comes to action with **qafilter**. If **qafilter** parameter is 1, then filters the tiles until the invalid pixels in those are <   **qacloudperc** |
| displaynormalvalues | float | No | 2000 | - | This parameter is used to normalize the band values for display purposes. Used for bands like RGB, AGR, etc. |
| legendtype | text | No | Relative | Relative, Absolute | Legend type of display ranges of resulting response. |
| resolution | float | No | 0.0001 | - | Cellsize in meters. |
| flatten\_data | Int, boolean | No | 0 | 0, 1 | Flatten data which has a list of Xcoord, Ycoord and Values for each band in the output. If 1, flatten\_data is returned. |
| statistics | Int, boolean | No | 1 | 0, 1 | Returns statistical features of the output .tif file. |
| return\_tif | int | No | 1 | 0, 1 | Returns the downloadable link to output raster. If 0, link will not be returned. |
| projection | text | No | Projection of AOI Given | **See Figure 5.** | Enter the desired projection for the result raster. See **Figure 5** for details. |





## Response Parameters

| Parameter | Data Type | Description |
| --- | --- | --- |
| download\_url | URL | URL to download result raster (.tif) file  |
| flattendtext | - | An array of Xcoords, Ycoords values from the .tif files. |
| tiledate | Date (mm/dd/yyyy) | The tile dates from where the band values are retrieved. |
| tilenames | - | List of the Blob names from the Azure Storage Container. |
| features | - | An array of features from the database. |
| features.attributes.CellSize | Resolution | Resolution of result Geotiff file in meters. |
| features.attributes.CoordinateSystem | - | Coordinate system of the result raster.  |
| features.attributes.Extent | - | Extents of the result raster. |
| features.attributes.Legend | List | Legend gives ranges of values for: **Area:** _Area covered in %_ ** Count** _: # of pixels from the result raster in range_ **CountAllPixels** _: Total # of pixels in result_ **Max** _: Maximum value in range_ **Min** _: Minimum value in range_ **Mean** _: Mean value in range_ **Color** _: Hex color used for value ranges_ |
| features.attributes.Matrix | List | Rows and Columns. |
| features.attributes.Max | Number | Maximum value from the result raster |
| features.attributes.Min | Number | Minimum value from the result raster |
| features.attributes.Mean | Number | Average value from the result raster |
| features.attributes.Percentile5 | Number | 5th percentile value from result raster |
| features.attributes.Percentile95 | Number | 95th percentile value from result raster |
| features.attributes.pngb64 | URL | base64png image of the result raster with legend entries |



## Figure 1.

_Acronyms and Definitions_

Acronym | Definition
--------|--------
 MSI | Multi-Spectral Instrument  
HLS |  Harmonized Landsat and Sentinel-2
HDF | Hierarchical Data Format
NIR | Near-Infrared
GLS | Global Land Survey
BRDF | Bidirectional Reflectance Distribution Function
NBAR | Nadir BRDF-normalized Reflectance
OLI | Operational Land Imager
QA | Quality assessment
SWIR | Short-wave Infrared
SDS | Scientific Data Sets
SR | Surface reflectance
SZA | Sun Zenith angle
NDVI | Normalized Difference Vegetation Index
UTM | Universal Transverse Mercator
WRS | Worldwide Reference System

## Figure 2.
_AOI Structure Examples_

##### JSON Example
 

    {"geometryType":"esriGeometryPolygon","features":[{"geometry":{"rings":[[[-92.678953,41.741707],[-
    92.678966,41.740563],[-92.678972,41.739963],[-92.67896,41.738874],[-92.686062,41.738873],[92.688546,41.738868],[-92.688544,41.739223],[-92.688555,41.743961],[-92.688124,41.743969],[-92.686658,41.744045],[-92.685481,41.74411],[-92.68513,41.744086],[-92.684627,41.743993],[92.684352,41.743833],[-92.683972,41.743603],[-92.683789,41.743476],[-92.683333,41.742983],[92.682923,41.742627],[-92.682497,41.742283],[-92.68213,41.742294],[-92.681444,41.742131],[92.680101,41.741842],[-92.679444,41.741817],[-92.679094,41.741713],[-92.678953,41.741707]]],"spatialReference":{"wkid":4326}}}]}


##### GEOJSON Example
  
    {"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-93.998809,41.993243],[-93.99873,41.988358],[94.001444,41.98838],[-94.00144,41.989089],[-94.003556,41.989116],[-94.003571,41.991767],[94.002054,41.991735],[-94.002086,41.993278],[-93.998809,41.993243]]]},"properties":{"OBJECTID":2038888,"CALCACRES":44.63000107,"CALCACRES2":null} ,"id":2038888} 
 
##### Shapefile Example
 
A Zip folder with following files [example.shp, example.prj, example.dbf, example.shx] 
 
##### Raster Example
 
A GeoTiff file of ‘.tif’ extension  



## Figure 3.
_Bands Information and Request Syntax_

##### Figure 3.
_HLS spectral bands nomenclature_

| **Band name** | **OLI band number** | **MSI band number** | **HLS band code name L8** | **HLS band code name S2** | **L30**** Subdataset number **|** S30 ****Subdataset number** | **Wavelength (micrometers)** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Coastal Aerosol | 1 | 1 | band01 | B01 | 01 | 01 | 0.43 – 0.45\* |
| Blue | 2 | 2 | band02 | B02 | 02 | 02 | 0.45 – 0.51\* |
| Green | 3 | 3 | band03 | B03 | 03 | 03 | 0.53 – 0.59\* |
| Red | 4 | 4 | band04 | B04 | 04 | 04 | 0.64 – 0.67\* |
| Red-Edge 1 |   | 5 |   | B05 |   | 05 | 0.69 – 0.71\*\* |
| Red-Edge 2 |   | 6 |   | B06 |   | 06 | 0.73 – 0.75\*\* |
| Red-Edge 3 |   | 7 |   | B07 |   | 07 | 0.77 – 0.79\*\* |
| NIR Broad |    | 8 |   | B08 |   | 08 | 0.78 –0.88\*\* |
| NIR Narrow | 5 | 8A | band05 | B8A | 05 | 09 | 0.85 – 0.88\* |
| SWIR 1 | 6 | 11 | band06 | B11 | 06 | 10 | 1.57 – 1.65\* |
| SWIR 2 | 7 | 12 | band07 | B12 | 07 | 11 | 2.11 – 2.29\* |
| Water vapor |   | 9 |   | B09 |   | 12 | 0.93 – 0.95\*\* |
| Cirrus | 9 | 10 | band09 | B10 | 08 | 13 | 1.36 – 1.38\* |
| Thermal Infrared 1 | 10 |   | band10 |   | 09 |   | 10.60 – 11.19\* |
| Thermal Infrared 2 | 11 |   | band11 |   | 10 |   | 11.50 – 12.51\* |
| QA |   |   |   |   | 11 | 14 |   |


## Figure 4
_Projection Syntax and Example_

##### Projection Syntax
_Projection: Projection of a new resampled raster. It may take the following forms:_
1. Well Known Text definition
2. &quot;EPSG:n&quot;
3. &quot;EPSGA:n&quot;
4. &quot;AUTO:proj\_id,unit\_id,lon0,lat0&quot; - WMS auto projections
5. &quot;urn:ogc:def:crs:EPSG::n&quot; - ogc urns
6. PROJ.4 definitions
    1. _6.__well known name, such as NAD27, NAD83, WGS84 or WGS72_
    2. _7.__&quot;IGNF:xxxx&quot;, &quot;ESRI:xxxx&quot;, etc. definitions from the   PROJ database_

_Projection Example:_
_&quot;urn:ogc:def:crs:EPSG::n&quot;_


## Figure 5

_Request Examples – form-data and urlencoded_

##### form-data
##### application/json
      { 
     Band: "['NDVI']" 
     Enddate: "3/8/2019" 
     Startdate: "3/2/2019" 
     aoi: "{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-93.511545,42.071053],[93.511565,42.074566],[-93.50667,42.074588],[-93.501908,42.074559],[-93.501936,42.071045],[-
    93.511545,42.071053]]]},"properties":{"OBJECTID":3350330,"CALCACRES":77.09999847,"CALCACRES2":null},"id":3350330}" 
    legendtype: "Relative" 
    satellite: "Landsat" 
    } 


##### application/x-www-form-urlencoded
        aoi=%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B-101.02684%2C38.598114%5D%2C%5B-101.026842%2C38.597962%5D%2C%5B-101.026956%2C38.59093%5D%2C%5B-101.028768%2C38.590943%5D%2C%5B-101.029234%2C38.590946%5D%2C%5B-101.035523%2C38.590991%5D%2C%5B-101.035526%2C38.590991%5D%2C%5B-101.035564%2C38.590991%5D%2C%5B-101.035576%2C38.590991%5D%2C%5B-101.035595%2C38.590991%5D%2C%5B-101.035956%2C38.590994%5D%2C%5B-101.035974%2C38.591099%5D%2C%5B-101.035957%2C38.594349%5D%2C%5B-101.036017%2C38.598193%5D%2C%5B-101.035203%2C38.598193%5D%2C%5B-101.033665%2C38.598182%5D%2C%5B-101.031726%2C38.598158%5D%2C%5B-101.02684%2C38.598114%5D%5D%5D%7D%2C%22properties%22%3A%7B%22OBJECTID%22%3A8091992%2C%22CALCACRES%22%3A156.1000061%2C%22CALCACRES2%22%3Anull%7D%2C%22id%22%3A8091992%7D&amp;satellite=Landsat%2CSentinel&amp;Band=%5B&#39;NDVI&#39;%5D&amp;filter=1&amp;interpolate=1&amp;showlatest=1&amp;resolution=0.0001&amp;statistics=1&amp;Startdate=9%2F26%2F2019&amp;Enddate=10%2F2%2F2019&amp;legendtype=Relative





## Figure 6

_Response Examples – JSON and XML_

##### JSON
```[
    {
        "Values": "",
        "Xcoordinates": "",
        "Ycoordinates": "",
        "band": "NDVI",
        "dayoftiles": "2019280-2019286",
        "download_url": "downloads/raster_bandNDVI_date2019280-2019286_20191028_202045_9592.tif",
        "error": "",
        "features": [
            {
                "attributes": {
                    "CellSize": [
                        0.0003450919525318096,
                        -0.0003450919525320728
                    ],
                    "CoordinateSystem": "GEOGCS[\"WGS 84\",DATUM[\"WGS_1984\",SPHEROID[\"WGS 84\",6378137,298.257223563,AUTHORITY[\"EPSG\",\"7030\"]],AUTHORITY[\"EPSG\",\"6326\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4326\"]]",
                    "Extent": "-99.05607495139091, 44.071737897653954, -99.04675746867255, 44.07622409303687",
                    "Legend": [
                        {
                            "Area": "5.13 %",
                            "Count": 18,
                            "CountAllPixels": 351,
                            "Max": 0.25481394966689086,
                            "Mean": 0.24510178002825062,
                            "Min": 0.2353896103896104,
                            "color": "#ff0000"
                        },
                        {
                            "Area": "58.69 %",
                            "Count": 206,
                            "CountAllPixels": 351,
                            "Max": 0.2742382889441713,
                            "Mean": 0.26452611930553105,
                            "Min": 0.25481394966689086,
                            "color": "#ff6666"
                        },
                        {
                            "Area": "28.21 %",
                            "Count": 99,
                            "CountAllPixels": 351,
                            "Max": 0.2936626282214518,
                            "Mean": 0.28395045858281154,
                            "Min": 0.2742382889441713,
                            "color": "#ffff66"
                        },
                        {
                            "Area": "4.27 %",
                            "Count": 15,
                            "CountAllPixels": 351,
                            "Max": 0.3130869674987322,
                            "Mean": 0.303374797860092,
                            "Min": 0.2936626282214518,
                            "color": "#ffff00"
                        },
                        {
                            "Area": "2.85 %",
                            "Count": 10,
                            "CountAllPixels": 351,
                            "Max": 0.3325113067760127,
                            "Mean": 0.32279913713737246,
                            "Min": 0.3130869674987322,
                            "color": "#66ff66"
                        },
                        {
                            "Area": "0.85 %",
                            "Count": 3,
                            "CountAllPixels": 351,
                            "Max": 0.35193564605329314,
                            "Mean": 0.3422234764146529,
                            "Min": 0.3325113067760127,
                            "color": "#00ff00"
                        }
                    ],
                    "Matrix": [
                        13,
                        27
                    ],
                    "Max": 0.35193564605329314,
                    "Mean": 0.27345243008865155,
                    "Min": 0.2353896103896104,
                    "OID": 0,
                    "Percentile5": 0.25480265232819305,
                    "Percentile95": 0.30446011009413093,
                    "Std": 0.015612864034601916,
                    "pngb64": "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABsAAAANCAYAAABYWxXTAAAAx0lEQVR4nK2Uaw6EIAyEPwxnLWeil+3+EFDAouvuJCZOC52+NGCYIRxQqDzxHJn5Tu6PbNIJ/QH5wlYS2BppGTniY5CroJNPy1PEtJLz5U68z87lK5TYextXWb6B06UIQFCQm9ldLcDom7h25qONv8BpaUJISPMHM4wwnBqrHOe5QldlLWSPt6Xa11Ubv1mGablqZVpWv9kdQdU5yN1SpSLUqBDz25k9qfZ0JgMRxP2OyU5Qz159VWioPoiJ5Serfwfv35iO9w9NyTh+0mirfQAAAABJRU5ErkJggg=="
                }
            }
        ],
        "nodata_raster": false,
        "tiledate": "10/07/2019-10/13/2019",
        "week": "40"
    }
]

```


##### XML

    [{"Values":"","Xcoordinates":"","Ycoordinates":"","band":"NDVI","dayoftiles":"2019280-2019286","download_url":"downloads/raster_bandNDVI_date2019280-2019286_20191028_202045_9592.tif","error":"","features":[{"attributes":{"CellSize":[0.0003450919525318096,-0.0003450919525320728],"CoordinateSystem":"GEOGCS[\"WGS 84\",DATUM[\"WGS_1984\",SPHEROID[\"WGS 84\",6378137,298.257223563,AUTHORITY[\"EPSG\",\"7030\"]],AUTHORITY[\"EPSG\",\"6326\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4326\"]]","Extent":"-99.05607495139091, 44.071737897653954, -99.04675746867255, 44.07622409303687","Legend":[{"Area":"5.13 %","Count":18,"CountAllPixels":351,"Max":0.25481394966689086,"Mean":0.24510178002825062,"Min":0.2353896103896104,"color":"#ff0000"},{"Area":"58.69 %","Count":206,"CountAllPixels":351,"Max":0.2742382889441713,"Mean":0.26452611930553105,"Min":0.25481394966689086,"color":"#ff6666"},{"Area":"28.21 %","Count":99,"CountAllPixels":351,"Max":0.2936626282214518,"Mean":0.28395045858281154,"Min":0.2742382889441713,"color":"#ffff66"},{"Area":"4.27 %","Count":15,"CountAllPixels":351,"Max":0.3130869674987322,"Mean":0.303374797860092,"Min":0.2936626282214518,"color":"#ffff00"},{"Area":"2.85 %","Count":10,"CountAllPixels":351,"Max":0.3325113067760127,"Mean":0.32279913713737246,"Min":0.3130869674987322,"color":"#66ff66"},{"Area":"0.85 %","Count":3,"CountAllPixels":351,"Max":0.35193564605329314,"Mean":0.3422234764146529,"Min":0.3325113067760127,"color":"#00ff00"}],"Matrix":[13,27],"Max":0.35193564605329314,"Mean":0.27345243008865155,"Min":0.2353896103896104,"OID":0,"Percentile5":0.25480265232819305,"Percentile95":0.30446011009413093,"Std":0.015612864034601916,"pngb64":"data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABsAAAANCAYAAABYWxXTAAAAx0lEQVR4nK2Uaw6EIAyEPwxnLWeil+3+EFDAouvuJCZOC52+NGCYIRxQqDzxHJn5Tu6PbNIJ/QH5wlYS2BppGTniY5CroJNPy1PEtJLz5U68z87lK5TYextXWb6B06UIQFCQm9ldLcDom7h25qONv8BpaUJISPMHM4wwnBqrHOe5QldlLWSPt6Xa11Ubv1mGablqZVpWv9kdQdU5yN1SpSLUqBDz25k9qfZ0JgMRxP2OyU5Qz159VWioPoiJ5Serfwfv35iO9w9NyTh+0mirfQAAAABJRU5ErkJggg=="}}],"nodata_raster":false,"tiledate":"10/07/2019-10/13/2019","week":"40"}]




## References

Claverie, M., Ju, J., Masek, J. G., Dungan, J. L., Vermote, E. F., Roger, J.-C., Skakun, S. V., &amp; Justice, C. (2018). The Harmonized Landsat and Sentinel-2 surface reflectance data set. Remote Sensing of Environment, 219, 145-161. ([https://doi.org/10.1016/j.rse.2018.09.002](https://doi.org/10.1016/j.rse.2018.09.002)).

## Citation
## Powered by Ag-Analytics®
 

**Spatial Reference Information:**
Universal Transverse Mercator (UTM) Dominant Zone, North American Datum 1983

Please contact [**support@analytics.ag**](mailto:support@analytics.ag),  [**josh@ag-analytics.org**](mailto:josh@ag-analytics.org), or  [**woodardjoshua@gmail.com**](mailto:woodardjoshua@gmail.com) with any comments or questions.

** **
