const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review=require("./review.js");
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
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;