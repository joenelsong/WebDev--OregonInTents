// ==========================================
// Update Weather Widget to desired location
// ==========================================

// defaults
var weatherContainer = document.getElementById("weather");
weatherContainer.style.display="none"; // Hide weather Container on startup
 
// weather specific event listener
document.getElementById("weatherLi").addEventListener("click", function(){
  
  // Set Location and Update Weather Widget
  document.querySelector("input[id=aw-search-input]").value = document.getElementById("cityStateHeader").textContent;
  document.querySelector("form > button.aw-submit-button").click();
  
  // Style Weather Widget
  setTimeout(function(){ 
    var widget = document.querySelector(".aw-widget-36hour-inner");
    widget.style['min-width'] = "264px"// resize widget
    widget.style['margin-right'] = "0px"// resize widget
    
    document.getElementById("link_get_widget").style.display="none"  // hide UI glitches
    //document.querySelector(".aw-search").style.display="none";
    
  }, 1500);

});


// Click event listeners applied to ALL list items
var listItems = document.getElementsByClassName("list-group-item");
for (var i = 0; i < listItems.length; i++) {
  listItems[i].addEventListener('click', function() {
      this.classList.toggle("active");
      
      var nextDiv = document.querySelector("#"+this.id + " + div");
      
      if (nextDiv.style.display === "none") {
       nextDiv.style.display="block"
      } else {
        nextDiv.style.display = "none";
      }
      
      
      
    }, false);
  
}
