const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner } = require('../middlewares.js');
const { validateListing } = require("../middlewares.js");
const listingController = require("../controllers/listing.js");

router.get("/", wrapAsync(listingController.index));

// new route
router.get("/new", isLoggedIn, listingController.newListing);
// show route
router.get("/:id", wrapAsync(listingController.showListing));
// create 
router.post("/", isLoggedIn, validateListing,
    wrapAsync(listingController.createListing)
);
//edit
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));
//update
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));
// delete
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;