if(process.env.NODE_ENV != "production"){  //we use dotenv file only in development phase
    require('dotenv').config()
}


const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");



const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const dbUrl = process.env.ATLASDB_URL;

//connect with mongodb
async function main(){
    await mongoose.connect(dbUrl);
}
main()
.then((res)=>{
    console.log("connection to DB successful");
})
.catch((err)=>{
    console.log(err);
});

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: "mysecretkey123"
    },
    touchAfter: 24 * 3600,     //for lazy updates(in sec)
})

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 3600 * 1000,
        maxAge: 7 * 24 * 3600 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());  // to initialize passport
app.use(passport.session());      //to verify user in a seesion from page to page

// use static authenticate method of model in LocalStrategy to authenticate user by username and password
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());   //serialize users into the session
passport.deserializeUser(User.deserializeUser());  // deserialize users into the session


app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewsRouter);
app.use("/", userRouter);



//other routes
app.all("*", (req, res) =>{
    throw new ExpressError(404, "Page not Found");
})

//error handling middleware
app.use((err, req, res, next)=>{
    // console.log(err);
    let {status = 500, message = "Something went Wrong"} = err;
    res.status(status).render("listings/error.ejs", {message});
})


app.listen(8080, ()=>{
    console.log("listening to port 8080");
})