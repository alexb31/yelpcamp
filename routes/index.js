var express = require("express"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    User = require("../models/user"),
    passport = require("passport"),
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
    var newUser = new User({username: req.body.username});
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

module.exports = router;