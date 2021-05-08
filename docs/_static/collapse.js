   
 window.onload=function(){ 
    var sections = ["cover-crop-data-prep","random-forest-classifier"]

    for (section in sections){
        var acc = document.getElementById(section);
        var sub = section.replace("-", "_");
       
         acc.addEventListener("click", function() {
       
           /* Toggle between hiding and showing the active panel */
           var yeet = $(section).next()
           var accordpanel = document.getElementById("module-AgAI.Projects.CoverCrop_Model.CoverCrop_Learning_v4.model.".concat(sub))
           if (accordpanel.style.display === "block") {
             accordpanel.style.display = "none";
           } else {
             accordpanel.style.display = "block";
           }
         });
    } 






 }