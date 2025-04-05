const Listing = require("../Models/listings.js");
 const Review = require("../Models/review.js");
 
 //create route
 module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id); // params is used when to access data from route/URL In this case ID is present
    let newReview = new Review(req.body.review); // body is used when we post data In our case it is review
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success"," New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};
 
 //destroy route
 module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted!");
    res.redirect(`/listings/${id}`);
};