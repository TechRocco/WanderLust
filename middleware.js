const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");   //to validate entry with JOI

module.exports.isloggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You have to Login first!");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
  
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not Authorized!");
        return res.redirect(`/listings/${id}/show`);
    }
    next();
};

module.exports.isAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
  
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not Authorized!");
        return res.redirect(`/listings/${id}/show`);
    }
    next();
};

//middleware to validate listing using JOI
module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error.message)
    }else{
        next();
    }
};

//middleware to validate Review
module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error.message)
    }else{
        next();
    }
};
