const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    // this is not necessary
    email: {         
        type: String,
        required: true
    }
})

//Passport-Local Mongoose will add a username, hash and salt field
userSchema.plugin(passportLocalMongoose);   //uses pbkdf2 hashing algorithm

module.exports = mongoose.model("User", userSchema); 