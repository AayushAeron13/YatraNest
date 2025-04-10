const Listing = require("./Models/listings.js");
const Review = require("./Models/review.js");
const {listingSchema} = require('./schema.js');
 const {reviewSchema} = require('./schema.js');
 const ExpressError = require('./utils/ExpressError.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You are not logged in!");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req, res, next) => {
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
}
module.exports.isOwner = async (req, res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validateListing = function (req, res, next) {
    let { error } = listingSchema.validate(req.body);  // yeh hai joi wala agar hoppscotch se bhejte hai toh post request bina kuch entries dale 
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}
module.exports.validateReview = (req, res, next) => {
     let { error } = reviewSchema.validate(req.body);
     if (error) {
         let errMsg = error.details.map((el) => el.message).join(",");
         throw new ExpressError(400, errMsg);
     }
     else
         next();
 };
 module.exports.isReviewAuthor = async function(req,res,next){
    let {id:listingId,reviewId}=req.params;
    let review =await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this review");
        return res.redirect(`/listings/${listingId}`);
    }
    next();
}