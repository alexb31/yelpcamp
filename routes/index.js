var express = require("express"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    User = require("../models/user"),
    Campground = require("../models/campground"),
    passport = require("passport"),
    async = require("async"),
    nodemailer = require("nodemailer"),    
    crypto = require("crypto"),
    router = express.Router();
    
router.get("/", function(req, res){
   res.render('landing'); 
});

// ===========
// AUTH ROUTES
// ===========

router.get("/register", function(req, res) {
    res.render("register", {page: 'register'});
});
// handle sign up Logic
router.post("/register", function(req, res) {
    var newUser = new User(
        {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            avatar: req.body.avatar
        });
    if(req.body.adminCode === "123Azertyu") {
        newUser.isAdmin = true;
    }
    
    User.register(newUser, req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.render("register", {error: err.message});
      }  else {
          passport.authenticate("local")(req, res, function(){
              req.flash("success", "Welcome to Yelpcamp " + user.username);
              res.redirect("/campgrounds");
          });
      }
   });
});

// ===========
// LOGIN ROUTES
// ===========

router.get("/login", function(req, res){
    res.render("login", {page: 'login'});
});

router.post("/login", passport.authenticate("local", {
   successRedirect: "/campgrounds",
   failureRedirect: "/login",
}) ,function(req, res){
});

//LOGOUT ROUTES

router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Logged you out");
   res.redirect("/campgrounds");
});

//// USERS PROFILE
router.get("/users/:id", function(req, res){
   User.findById(req.params.id, function(err, foundUser){
       if(err){
           req.flash("error", "Something went wrong.");
           res.redirect("/");
       }
       Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
           if(err){
           req.flash("error", "Something went wrong.");
           res.redirect("/");
       }
        res.render("users/show", {user: foundUser, campgrounds: campgrounds});
       })
   });
});

module.exports = router;