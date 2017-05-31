Version 9: 
* Now require authentication to create new campgrounds
* Updated Campground Schema to contain information about the author who submitted the campground
* Now showing the campground submission's author's name on the show page ('/campgrounds/:id')



Technology Stack:

* Node.js
* Express.js
* EJS.js templates
* MongoDB/Mongoose

* HTML5
* CSS3 w/ bootstrap.css

# RESTFUL ROUTES

## Campgrounds
### name |   url              |  verb  |   description                             
----------------------------------------------------------------------------------
* INDEX  |  /campgrounds      |  GET   |   Display a list of all campgrounds
* NEW    |  /campgrounds/new  |  GET   |   Displays form to make a new campgrounds
* CREATE |  /campgrounds      |  POST  |   Creates a new campground entry
* SHOW   |  /campgrounds:id   |  GET   |   Shows info about one Campgrounds


#NESTED ROUTES

## Comments
### name      url         verb            desc.
----------------------------------------------------------------------------------
* NEW     campgrounds/:id/comments/new    GET
* CREATE  campgrounds/:id/comments/       POST
