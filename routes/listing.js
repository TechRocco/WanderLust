const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
// const Listing = require("../models/listing.js");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const Listing = require("../models/listing.js");
const upload = multer({ storage });




router.route("/")
//all listings
.get(asyncWrap(listingController.index))
//create route
.post( isloggedIn, upload.single("image"), validateListing, asyncWrap(listingController.createNew)); 

//filter listing using search
router.get("/search",asyncWrap(listingController.filteredListings))
 

//listing in detail
router.get("/:id/show", asyncWrap(listingController.show));

//new listing
router.get("/new", isloggedIn, listingController.createForm);

//edit Listing
router.get("/:id/edit", isloggedIn, isOwner, asyncWrap(listingController.editForm));



router.route("/:id")
//update route
.put(isloggedIn, isOwner, upload.single("image"), validateListing, asyncWrap(listingController.updateListing))
//delete listing
.delete(isloggedIn, isOwner, asyncWrap(listingController.destroyListing));

module.exports = router;