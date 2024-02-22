const express = require("express");
const router = express.Router({mergeParams: true});   // mergeparams: to merge params of parent with child
// const Listing = require("../models/listing.js");
// const Review = require("../models/review.js");
const asyncWrap = require("../utils/asyncWrap.js");
const { isloggedIn, validateReview, isAuthor }  = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



//redirect on login
router.get("/", (req, res)=>{
    let {id} = req.params;
    res.redirect(`/listings/${id}/show`);
})

// create review
router.post("/", isloggedIn, validateReview, asyncWrap(reviewController.createReview));


//delete review
router.delete("/:reviewId", isloggedIn, isAuthor, asyncWrap(reviewController.destroyReview));

module.exports = router;