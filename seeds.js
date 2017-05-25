var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
  {
    name: "Armitage Park Campground",
    image: "http://www.campingroadtrip.com/DesktopModules/CRT_Campground_Media/FilePipe.aspx?id=4/26/2017%203:00:53%20AM&memberid=6848&rnd=116&file=a78bc1b0-1230-4662-90a3-6018f2c534b1.jpg",
    description:"A favorite local park. Along the McKenzie River. Large and small covered picnic areas. Now Camping for RVs and tents."
  },
  {
    name: "Pine Meadows Campground",
    image: "http://static.panoramio.com/photos/large/23932321.jpg",
    description: "Great stars at night. Wonderful lake because it's relatively warm, not over-run, terrific small boat sailing with a very dependable breeze out of the north almost daily. Great Ranger staff, always helpful, pleasant hosts. Only open from mid-May thru mid-September...so plan accordingly. Reservations highly recommended"
  },
  { 
    name: "Richardson Park",
    image: "http://www.sewthankfulblog.com/wp-content/uploads/2015/08/RichardsonParkCamp.jpg",
    description: "Nice park. Camping. Clean campground  Showers. Large lake."
  }
  
];

function seedDB(){
  //Remove all campgrounds
  Campground.remove({}, function(err){
    if(err) {
      console.log(err);
    } 
    else {
      console.log("Removed campgrounds");
      
      //add a few campgrounds
      data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
          if(err){
            console.log(err);
          } else {
            console.log("Added a Campground");
            
            //create a comment
            Comment.create(
              {
                text: "this is me leaving a comment...",
                author: "John Doe"
              }, function(err, comment){
                if(err){
                  console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    console.log("Commented added to " + campground.name);
                }
                
            });
                
          }
        });
      });
    }
  });

}

module.exports = seedDB;