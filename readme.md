Technology Stack:

* Node.js
* Express.js
* EJS.js templates
* MongoDB/Mongoose
* Passport JS Login
* Connect-Flash Flash Messages


* Google reCaptcha
* Google Maps API
* AccuWeather API

* Bootstrap.css

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

TO DO:
* Password Reset
* User Profiles
* Add Filters
- Sort campgrounds by Rating
- Sort campgrounds by Distance
* Stripe Payment / Bitcoin Donation Links
* Implement campground rating system
- Make a cron job to automatically delete entries with very low ratings that have existed for a certain period of time.
