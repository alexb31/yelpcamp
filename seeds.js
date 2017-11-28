var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment")
    
var data = [
    {
        name: "Cloud's Rest",
        image : "https://farm5.staticflickr.com/4127/5040999230_9209271d68.jpg",
        description : "blah blah blah"
    },
    {
        name: "Cloud's Rest V2",
        image : "https://farm5.staticflickr.com/4081/4886538533_d94d9eaa4b.jpg",
        description : "Lorem Ipsum"
    },
    {
        name: "Cloud's Rest V3",
        image : "https://farm8.staticflickr.com/7178/6777351088_b517e3e972.jpg",
        description : "Prout"
    }
]
    
    function seedDB(){
        //Remove all Campgrounds
        Campground.remove({}, function(err){
    if(err){
        console.log(err)
    } else {
        //Add a few campgrounds
        console.log("Removed Campground");
        data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
          if(err){
              console.log(err);
          } else {
              console.log("YES");
              //Create comment
              Comment.create(
                  {
                    text: "This place is great",
                    author: "Alex" 
              }, function(err, comment){
                  if(err){
                    console.log(err);
                  } else {
                    campground.comments.push(comment);
                    campground.save();
                    console.log("Created New Comment");
                  }
              })
          }
      })  
    })   
    }
});
    //Add a few comments
}
    
module.exports = seedDB;