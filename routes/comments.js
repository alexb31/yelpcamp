var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ===============
// COMMENTS ROUTES
// ===============


//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //Find Campground by Id
    Campground.findById(req.params.id, function(err ,campground){
        if(err){
            console.log(err);
        } else {
          res.render("comments/new", {campground: campground});      
        }
    });
});


//Comments create
router.post("/", middleware.isLoggedIn, function(req, res){
    //Lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        //create new comment   
         var newComment = req.body.comment;
        Comment.create(newComment, function(err, comment){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
        } else {
            //add username & id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            //save comment
            comment.save();
            campground.comments.push(comment);
            campground.save();
            req.flash("success", "Successfully added  comment");
            //redirect
            res.redirect("/campgrounds/" + campground._id);
        }
    });
       }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error", "No camground found");
            res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
           console.log(err);
       } else {
           res.render("comments/edit", {campground_id : req.params.id, comment : foundComment});    
       }
    });
    });
});

// COMMENT UPDATE

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// COMMENT DELETE ROUTE

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   //findByIdAndRemove
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/campgrounds/" + req.params.id);
       }
   })
});

module.exports = router;