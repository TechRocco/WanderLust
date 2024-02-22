const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initialData = require("./data.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main()
.then((res)=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

const initDB = async()=>{
    await Listing.deleteMany({});
    initialData.data =  initialData.data.map((obj) => ({...obj, owner: "65ca3252b822ee3f553f42f5" }));
    await Listing.insertMany(initialData.data);
    console.log("DB is initialized");
}

initDB();