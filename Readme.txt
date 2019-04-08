Overview of Jupyternotebooks:

Requirements:
-Install gdal, fiona, shapely, and geopandas from https://www.lfd.uci.edu/~gohlke/pythonlibs/
-Install all other dependences including pandas, descartes, requests, jupyter, and any others.
-Obtain an API key (free) from https://ag-analytics.org/ApiDeveloper

In all the below four apis followings steps are followed in jupyter notebooks
               i)CLU
               ii) CDL
               iii)Polaris Soils
               iv) SSURGO Soils

        1) create a request parameters
        2) call the repective api's
        3) if the response is geojson, 
                     directly converting the geojson response to shapefiles by using external api
                     
           else if the response is json
                     converting the json response to geojson and then to shapefiles by using external api
         4) Displaying the shapefiles as map using geopandas
         
         
In all the below four apis followings steps are followed in jupyter notebooks 
               v) Insurance quoter
               vi) Precipitation
               vii) Prismgdd
               viii)emodis  
               
        1) create a request parameters
        2) call the repective api's
        3) the reponse is converetd to respective tabular formats or plotted like graphs



Steps:


1) Make sure that shapefiles and json folders are created and correctly pointed to those in the code in jupyternotebooks

Note: Currently the code picks the shapefiles and jsonfiles folders from the folder where jupyternotebook is running.

2) Please enter the Valid subscription key int he placeholder of Ocp-Apim-Subscription-Key in headers of request parameters

Contents of the folder:

            1)shapefiles: This folder is used to store the shapefiles while converting from geojson to shapefiles for displaying the map
            2)jsonfles  : This folder is used to store the geojson format output while converting from json to geojson for creating shapefiles inorder to display map in next steps
            3)cropnames_gridcodes_mappings.csv  : This file has mappings of Gridcode and cropnames used by CDL API
            4) Jupyternotebook_steps.docx  : Steps to run jupyter notebooks through command prompt


            5) Jupyter notebooks of .ipynb format for all 8 API's
               
               i)CLU
               ii) CDL
               iii)Polaris Soils
               iv) SSURGO Soils
                v) Insurance quoter
               vi) Precipitation
               vii) Prismgdd
               viii)emodis  
               
            6) HTML files of the jupyter notebooks are avilable in htmlfiles1.3 version folder
    

  
Steps to Run Jupyternotebooks:
            Please follow the steps in the Jupyternotebook_steps.docx




        
           
