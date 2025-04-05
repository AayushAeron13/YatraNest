const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner } = require('../middlewares.js');
const { validateListing } = require("../middlewares.js");
const listingController = require("../controllers/listing.js");

router
   .route("/")
   .get(wrapAsync(listingController.index))
   .post(
     isLoggedIn,
     validateListing,
     wrapAsync(listingController.createListing)
   );

// new route
router.get("/new", isLoggedIn, listingController.newListing);
router
   .route("/:id")
   .get(wrapAsync(listingController.showListing))
   .put(
     isLoggedIn,
     isOwner,
     validateListing,
     wrapAsync(listingController.updateListing)
   )
   .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
//edit
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;