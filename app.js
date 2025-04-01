const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./Models/listings");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./Models/review");
const listings =require("./routes/listing.js");

main()
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/YatraNest");
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")))

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});
// wrapAsync helps karta hai agar koi error us taks ko karne mein aata hai toh woh 
//error handling middlware ke pass chala jaye kyunk asunchronous next ko call nhi karte automatically

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else
        next();
};
app.use("/listings",listings)
// review post
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id); // params is used when to access data from route/URL In this case ID is present
    let newReview = new Review(req.body.review); // body is used when we post data In our case it is review
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));
//delete review
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs", { message });
})
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
