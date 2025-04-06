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
    let url = req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image.url=url;
    newListing.image.filename=filename;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};
 
 //edit route
 module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let original_image_url=listing.image.url;
    original_image_url=original_image_url.replace("/upload","/upload/h_200,w_250");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    else
        res.render("listings/edit.ejs", { listing, original_image_url  });

 };
 
 //update route
 module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if((typeof req.file) !="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
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