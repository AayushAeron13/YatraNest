const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const { saveRedirectUrl } = require('../middlewares.js');
const userController = require("../controllers/user.js");

router
   .route("/signup")
   .get(userController.signupPage)
   .post(wrapAsync(userController.signup));
router
   .route("/login")
   .get(userController.loginPage)
   .post(saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    wrapAsync(userController.login)
);
router.get("/logout", userController.logout)
module.exports = router;