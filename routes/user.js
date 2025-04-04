const express = require('express');
const router = express.Router();
const User = require('../Models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);}
            req.flash("success", "Welcome to YatraNest");
            res.redirect("/listings");
        });
    }
    catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    wrapAsync(async (req, res) => {
        req.flash("success", `Welcome back ${req.body.username}`);
        res.redirect("/listings");
    })
);
router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err)
            return next(err);
        else {
            req.flash("success", "Successfully logged out , See you Again Soon!");
            res.redirect("/listings");
        }
    });
})
module.exports = router;