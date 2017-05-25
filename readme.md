Version 5: 
* Added styling, mostly to show page
* Added new elements to show page for future implementations


Technology Stack:

* Node.js
* Express.js
* EJS.js templates
* MongoDB/Mongoose

* HTML5
* CSS3 w/ bootstrap.css

# RESTFUL ROUTES

## Campgrounds
* name      url         verb            desc.
* ---------------------------------------------------------------------------
* INDEX    /campgrounds        GET      Display a list of all campgrounds
* NEW      /campgrounds/new    GET      Displays form to make a new campgrounds
* CREATE   /campgrounds        POST     Creates a new campground entry
* SHOW     /campgrounds:id     GET      Shows info about one campground


#NESTED ROUTES

## Comments

* NEW     campgrounds/:id/comments/new    GET
* CREATE  campgrounds/:id/comments/       POST
