var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDb = require("./seeds"),


//Requiring Routes    
    commentRoutes = require("./routes/comments"),
    campgroundsRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")

 var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v11";
mongoose.connect(url);

//mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb://alex:123Azertyu@ds123796.mlab.com:23796/yelpcamp");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
//seed data seedDb(); 

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "YOLO",
    resave: false,
    saveUninitialized: false
}));

app.locals.moment = require('moment'),
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || "3000");