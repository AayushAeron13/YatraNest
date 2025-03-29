const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// a model is a class that interacts with mongodb collection and provides methods
// like create,read,update and delete
// Mongoose is necessary to provide Schema which provides consistency,validty,and 
// many operations like using middlewares as we know in mongodb we have different types of
// key-value pairs in different data-ID
const listingSchema = new Schema({
   title: {
    type: String,
    required: true,
  },
  description: String,
  image: { 
    filename: String, 
    url: String 
  },
    price: Number,
    location: String,
    country: String,
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports=Listing;