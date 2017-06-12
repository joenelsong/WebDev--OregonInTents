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

Version 14: 
* Implemented reCaptcha V2 to verify human registrations and exclude robots (https://www.google.com/recaptcha)
* Added Secret Campgrounds for members only
* Deployed app on Heroku
..* Need to configure Heroku app to connect to mlab database ( working on c9.io)
..* Need to set google captcha domain for heroku app
* Launched New MongoDB on https://mlab.com
* Now have a Test Server and Production Database