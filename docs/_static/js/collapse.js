   
 window.onload=function(){ 
    // Link up to jQuery and append link to head
    let script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);

    // All accordion menu buttons go here
    let sections = [document.getElementById("tillage-model-forecast-v4"),document.getElementById("tillage-forecast-testscript"),document.getElementById("tillage-preprocessing"),
                    document.getElementById("other-preprocessing-methods"),document.getElementById("variety-retrieval"),document.getElementById("variety-api-test"),
                    document.getElementById("variety-local-testing"),document.getElementById("variety-json-test"),document.getElementById("ssurgo-service-api"),
                    document.getElementById("yield-model-forecast-v3"),document.getElementById("polaris-service"),document.getElementById("planting-date-forecast"),
                    document.getElementById("operation-service"),document.getElementById("application-service-api"),document.getElementById("nitrogen-parser"),
                    document.getElementById("application-api-test-script"),document.getElementById("nutrient-summary-processing"),document.getElementById("nutrient-summary-processing-queries"),
                    document.getElementById("naip-service-api"),document.getElementById("naip-processing"),document.getElementById("tile-service"),document.getElementById("harvest-day-forecast"),
                    document.getElementById("guidance-lines-api"),document.getElementById("elevation-index-service"),document.getElementById("crp-service-api"),document.getElementById("dem-service"),
                    document.getElementById("cdl-service-api"),document.getElementById("cdl-rr-processing"),document.getElementById("cdl-rr-constants"),document.getElementById("crop-id-model-forecast"),
                    document.getElementById("cover-crop-forecast"),document.getElementById("cover-crop-forecast-testing"),document.getElementById("cover-crop-preprocessing"),document.getElementById("data-prepare-wrapper"),
                    document.getElementById("summary-processing"),document.getElementById("random-forest-classifier"),document.getElementById("cover-crop-data-prep"),document.getElementById("chemical-retriever"),
                    document.getElementById("chemical-api-test"),document.getElementById("chemical-summary-processing"),document.getElementById("chemical-summary-processing-queries"),
                    document.getElementById("adapt-external-api-service"),document.getElementById("boundary-service-database-dict"),document.getElementById("boundary-service-api"),document.getElementById("aggregate-adapt-response"),
                    document.getElementById("tillage-data-collection"),document.getElementById("process-tillage-data") ]

    // Set up the necessary CSS classes
    for (let i = 0; i < sections.length; i++) {
        try {
            let elem = sections[i]
            let classes = elem.classList;
            // Add hover class to accordion buttons
            classes.add("hoverable");

            // Make sure that accordion content is hidden by default
            let content = $(elem).next().attr("id");
            let accordpanel = document.getElementById(content)
            accordpanel.classList.add("accordpanel")
        } catch (error) {
            console.log(error);
        }
    }


    // Click function to expand and collapse accordion menus
    sections.forEach(function(elem) {
        try {
            elem.addEventListener("click", function() {
                
                    // Get siblings of clickable accordpanel elements 
                    let content = $(elem).next().attr("id");
                    console.log(content)
                    // Toggle visibility of panels
                    let accordpanel = document.getElementById(content)
                    accordpanel.classList.toggle('accordpanel');
                    accordpanel.classList.toggle('accordactive');

            });
        } catch (error) {
            console.log(error);
        }
    });

 }