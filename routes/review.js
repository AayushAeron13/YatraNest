 const express = require('express');
 const router = express.Router({mergeParams:true}); // yeh help karta jo common path app.js mein eh gaya uska access review,js mein bhi mil jaye jaise ki delete ke time pe hame id chahiye jo mergeparams ko true karne pe hi milegi
 const Review = require('../Models/review.js');
 const wrapAsync =  require('../utils/wrapAsync.js');
 const Listing = require("../Models/listings");
 const {validateReview, isLoggedIn} = require('../middlewares.js');
 
// review post
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id); // params is used when to access data from route/URL In this case ID is present
    let newReview = new Review(req.body.review); // body is used when we post data In our case it is review
    newReview.author = req.user._id;
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