const express = require('express');
 const router = express.Router({mergeParams:true});
 const Review = require('../Models/review.js');
 const wrapAsync =  require('../utils/wrapAsync.js');
 const ExpressError = require('../utils/ExpressError.js');
 const {reviewSchema} = require('../schema.js');
 const Listing = require("../Models/listings");

 const validateReview = (req, res, next) => {
     let { error } = reviewSchema.validate(req.body);
     if (error) {
         let errMsg = error.details.map((el) => el.message).join(",");
         throw new ExpressError(400, errMsg);
     }
     else
         next();
 };
// review post
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id); // params is used when to access data from route/URL In this case ID is present
    let newReview = new Review(req.body.review); // body is used when we post data In our case it is review
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success"," New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}));
//delete review
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted!");
    res.redirect(`/listings/${id}`);
}));
module.exports=router;