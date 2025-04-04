const Listing = require("../Models/listings.js");
 
 //index route
 module.exports.index = async (req, res) => {
     const allListings = await Listing.find({});
     res.render("listings/index.ejs", { allListings });
 
 };
 
 //new route
 module.exports.newListing = (req, res) => {
    res.render("listings/new.ejs");
};
 
 //show route
 module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    else
        res.render("listings/show.ejs", { listing });
};
 
 //create route
 module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};
 
 //edit route
 module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    else
        res.render("listings/edit.ejs", { listing });

 };
 
 //update route
 module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", " Listing Updated!");
    res.redirect(`/listings/${id}`);
};
 
 //destroy route
 module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
};