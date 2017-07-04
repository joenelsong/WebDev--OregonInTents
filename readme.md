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
### name |   url                       |  verb   |   description                             
----------------------------------------------------------------------------------
* INDEX   |  /campgrounds              |  GET    |   Display a list of all campgrounds
* NEW     |  /campgrounds/new          |  GET    |   Displays form to make a new campgrounds
* CREATE  |  /campgrounds              |  POST   |   Creates a new campground entry
* SHOW    |  /campgrounds:id           |  GET    |   Shows info about one Campgrounds
* EDIT    |  /campgrounds/:id/edit     |  GET    |   Displays form to edit campground data
* UPDATE  |  /campgrounds/:id/         |  PUT    |   Pushes campground edits to the database
* DESTROY |  /campgrounds/:id/         |  DELETE |   Deletes campground from the database

* APPROVE |  /campgrounds/:id/approve  |  POST  |   Approves campground and awards points to self and author
* REJECT  |  /campgrounds/:id/reject   |  POST  |   Deletes campground and awards points to self


# NESTED ROUTES

## Campgrounds/Comments
### name |   url                                        |  verb   |   description      
----------------------------------------------------------------------------------
* NEW     |  /campgrounds/:id/comments/new              |  GET    |   Display a form to create a new comment
* CREATE  |  /campgrounds/:id/comments/                 |  POST   |   Creates a new comment
* EDIT    |  /campgrounds/:id/comments/comment_id/edit  |  GET    |   Displays form to edit a comment
* UPDATE  |  /campgrounds/:id/comments/comment_id       |  PUT    |   Pushed comment edits to the database
* DESTROY |  /campgrounds/:id/comments/comment_id       |  DELETE |   Deletes comment from the database


# TO DO:
* Password Reset
* User Profiles
* Add Filters
  - Sort campgrounds by Rating
  - Sort campgrounds by Distance
* Stripe Payment / Bitcoin Donation Links
* Implement campground rating system
  - Make a cron job to automatically delete entries with very low ratings that have existed for a certain period of time.
