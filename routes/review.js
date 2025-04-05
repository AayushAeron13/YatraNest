 const express = require('express');
 const router = express.Router({mergeParams:true}); // yeh help karta jo common path app.js mein eh gaya uska access review,js mein bhi mil jaye jaise ki delete ke time pe hame id chahiye jo mergeparams ko true karne pe hi milegi
 const wrapAsync =  require('../utils/wrapAsync.js');
 const {validateReview, isLoggedIn,isReviewAuthor} = require('../middlewares.js');
 const reviewController = require("../controllers/review.js");

// review post
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
module.exports=router;