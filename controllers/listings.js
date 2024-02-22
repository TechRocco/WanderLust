const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding-v6.js")
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken})   //connection with geocoding using token


module.exports.index = async(req, res)=>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
    // console.log(req.user);
};

module.exports.filteredListings =  async(req, res)=>{
    let {keyword} = req.query;
    let key = keyword.toLowerCase();
    console.log(key);
    let listings = await Listing.find();
    let allListings = listings.filter((list) =>{
     return (list.location).toLowerCase() === `${key}` || (list.country).toLowerCase() === `${key}` || (list.title).toLowerCase() === `${key}`;
    });
 
    for(list of listings){
        let keyValues = await list.description.toString().split(" ");
        // console.log(keyValues)
        for (let keys of keyValues){
            
            if(keys === key){
             // console.log(list)
            allListings.push(list)
         }
     }
    }
    if(allListings.length != 0){
    res.render("listings/index.ejs", {allListings}); 
    }else{
     req.flash("error", `No such listings found for '${key}'`);
     res.redirect("/listings");
    }
 }

module.exports.show = async(req, res)=>{
    let {id} = req.params;

    // populare({path: " ", populate: {path: " "}}) is used for nested populating
    let list = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
    // console.log(list);
    if(!list){
        req.flash("error", "Listing Not Found");
        res.redirect("/listings");
    }else{
    res.render("listings/show.ejs", {list});
    }
};

module.exports.createForm = (req, res)=>{
    res.render("listings/new.ejs");
};

module.exports.createNew = async(req, res)=>{
    if(!req.file){
        req.flash("error", "Kindly Upload Image");
        res.redirect("/listings/new");
    }

    let response = await geocodingClient.forwardGeocode({
        query: req.body.location,  //location for coordinates
        limit: 1     // number of nearby coordinates
    })
    .send();
    console.log (response.body.features[0].geometry)

    let url = req.file.path;
    let filename = req.file.filename;
    
    let {title, description, price, location, country} = req.body;
    let newListing = new Listing({
        title: title,
        description: description,
        image: {url: url, filename: filename},
        price: price,
        location: location,
        country: country,
    })
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry    //respose will return an object

    // const newListing = new Listing(req.body);
   let saved =  await newListing.save();
    console.log(saved);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.editForm = async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing Not Found");
        res.redirect("/listings");
    }else{
        res.render("listings/edit.ejs", {listing});
    }  
};

module.exports.updateListing = async(req, res)=>{
  
    let {id} = req.params;
    let {title, description, price, location, country} = req.body;
    // console.log(req.body);
    let listing = await Listing.findByIdAndUpdate(id,
        {title: title, description: description,
        price: price, location: location, country: country});


        if(typeof req.file !== "undefined"){
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = {url, filename};
            await listing.save();
        }   
    console.log("Updated");
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}/show`);  
};

module.exports.destroyListing = async(req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
    // console.log(deletedListing); 

    console.log("deleted");
};