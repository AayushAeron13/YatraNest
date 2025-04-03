 const express = require('express');
 const router = express.Router();
 const Listing = require('../Models/listings.js');
 const wrapAsync =  require('../utils/wrapAsync.js');
 const ExpressError = require('../utils/ExpressError.js');
 const {listingSchema} = require('../schema.js');
 const {isLoggedIn}=require('../middlewares.js');

 //schema validation 
 validateListing=function(req,res,next){
     let {error}=listingSchema.validate(req.body);  // yeh hai joi wala agar hoppscotch se bhejte hai toh post request bina kuch entries dale 
     if(error){
         let errMsg=error.details.map((el)=>el.message).join(",");
         throw new ExpressError(400,errMsg);
     }else{
         next();
     }
 }
 
 router.get("/", wrapAsync(async (req, res) => {
     const allListings = await Listing.find({});
     res.render("listings/index.ejs", { allListings });
 
 }));
 
 // new route
 router.get("/new",isLoggedIn, (req, res) => {
     res.render("listings/new.ejs");
 });
 // show route
 router.get("/:id", wrapAsync(async (req, res) => {
     let { id } = req.params;
     const listing = await Listing.findById(id).populate("reviews");
     if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
     }
     else
     res.render("listings/show.ejs", { listing });
 }));
 // create 
 router.post("/", isLoggedIn,validateListing,
     wrapAsync(async (req, res, next) => {
         const newListing = new Listing(req.body.listing);
         await newListing.save();
         req.flash("success","New Listing Created!");
         res.redirect("/listings");
     })
 );
 //edit
 router.get("/:id/edit", isLoggedIn,wrapAsync(async (req, res) => {
     let { id } = req.params;
     const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
     }
     else
     res.render("listings/edit.ejs", { listing });
 }));
 //update
 router.put("/:id",isLoggedIn, validateListing, wrapAsync(async (req, res) => {
     let { id } = req.params;
     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     req.flash("success"," Listing Updated!");
     res.redirect(`/listings/${id}`);
 }));
 // delete
 router.delete("/:id", isLoggedIn,wrapAsync(async (req, res) => {
     let { id } = req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success"," Listing Deleted!");
     res.redirect("/listings");
 }));
 
 module.exports = router;