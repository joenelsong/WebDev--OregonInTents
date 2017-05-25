var mongoose = require("mongoose");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId, // association by reference
      ref: "Comment"
    }
    ]
});

var Campground = mongoose.model("Campground", campgroundSchema); // model

module.exports = Campground;

/*Campground.create(
  {name: "Pine Meadows Campground",
  image: "http://static.panoramio.com/photos/large/23932321.jpg",
  description: "Great stars at night. Wonderful lake because it's relatively warm, not over-run, terrific small boat sailing with a very dependable breeze out of the north almost daily. Great Ranger staff, always helpful, pleasant hosts. Only open from mid-May thru mid-September...so plan accordingly. Reservations highly recommended"}
  , function(err, campground){
    if(err){
      console.log(err);
    } else {
      console.log("NEW CAMPGROUND: "+campground);
    }
  });
*/
  /*var campgrounds = [
  {name: "Armitage Park Campground",
  image: "http://www.campingroadtrip.com/DesktopModules/CRT_Campground_Media/FilePipe.aspx?id=4/26/2017%203:00:53%20AM&memberid=6848&rnd=116&file=a78bc1b0-1230-4662-90a3-6018f2c534b1.jpg",
  description:"A favorite local park. Along the McKenzie River. Large and small covered picnic areas. Now Camping for RVs and tents."}
  ,
  {name: "Pine Meadows Campground",
  image: "http://static.panoramio.com/photos/large/23932321.jpg",
  description: "Great stars at night. Wonderful lake because it's relatively warm, not over-run, terrific small boat sailing with a very dependable breeze out of the north almost daily. Great Ranger staff, always helpful, pleasant hosts. Only open from mid-May thru mid-September...so plan accordingly. Reservations highly recommended"}
  
  Richardson Park
  http://www.sewthankfulblog.com/wp-content/uploads/2015/08/RichardsonParkCamp.jpg
  Nice park. Camping. Clean campground  Showers. Large lake.
  
  ]
*/