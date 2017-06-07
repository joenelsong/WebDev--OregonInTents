var mongoose = require("mongoose");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  description: String,
  website: String,
  location: String,
  lat: Number,
  lng: Number,
  author: {
            id: { 
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User"
                },
            username: String
  },
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
 
  { 
  name: Cascadia State Park
  location: Cascadia State Park, Cascadia, OR
  image: https://oregonstateparks.reserveamerica.com/webphotos/OR/pid402240/0/540x360.jpg
  price: 17.00
  website: http://oregonstateparks.org/index.cfm?do=parkPage.dsp_parkPage&parkId=150
  description: "Cascadia State Park is located on Highway 20, on the western slope of the Cascade Mountains, where
                Soda Creek flows into the South Santiam River. There are 25 first-come, first-serve primitive campsites, 2 reservable
                group tent areas, 2 reservable group picnic areas with covered kitchen shelters and electricity and ADA accessible restrooms and showers.
                The park is remote, quiet and loaded with history. There are trails to crystal clear South Santiam River for swimming and fishing.
                A short hike from the campground leads through lush forest to a 150 foot ribbon of Soda Creek known as Lower Soda Creek Falls. "

  }
  ]
*/