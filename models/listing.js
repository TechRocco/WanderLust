const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
    title: {
        type: String,  
    },
    description: {
        type: String,
    },
    image: {
        filename: {
            type: String,
            default: "default filename"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        }
    },


    price: {
        type: Number
    },

    location: {
        type: String
    },

    country: {
        type: String
    },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          
        },
        coordinates: {
          type: [Number],
        //   required: true
        }
      }

});
 

//post mongoose middleware to delete all reviews of listing when lisitng is deleted
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){ 
    await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
