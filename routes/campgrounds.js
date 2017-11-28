var express = require("express"),
    Campground = require("../models/campground"),
    router = express.Router(),
    middleware = require("../middleware");
    
//INDEX - SHOW ALL CAMPGROUNDS    
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
        } else {
            console.log(allCampgrounds);
            res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
        }
    })
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render('campgrounds/new'); 
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author, price: price};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect('/campgrounds');      
        }
    })
});


//SHOW more info about one camground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back")
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});      
        }
    })
});

// EDIT CAMPGROUND ROUTE

 router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
     // is logged in ?
         Campground.findById(req.params.id, function(err, foundCampground){
             res.render("campgrounds/edit", {campground: foundCampground});
        });   
    });

//UPDATE CAMPGROUND ROUTE

router.put("/:id", function(req, res){
        //req.body.campground.body = req.sanitize(req.body.campground.body);
       Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
           if(err) {
               console.log(err);
               res.redirect("/");
           } else {
               res.redirect("/campgrounds/" + req.params.id);
           }
       }) 
    });
    
//DELETE ROUTE
    
router.delete("/:id", function(req, res){
   Campground.findByIdAndRemove(req.params.id, middleware.checkCampgroundOwnership, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
   }) 
});


module.exports = router;